import http from 'k6/http';
import { check, sleep } from 'k6';
import { Trend } from 'k6/metrics';

// Você pode usar: BASE_URL=http://localhost:3000 k6 run load_test.js
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

const metrics = {
    requests: new Trend('requests_duration_ms'),
};

// Todas as rotas do seu sistema
const routes = {
    livros: `${BASE_URL}/livros`,
    pessoas: `${BASE_URL}/pessoas`,
    emprestimo: `${BASE_URL}/emprestimo`,
};

// ======================================================================
// DEFINIÇÃO DOS CENÁRIOS
// ======================================================================
export const options = {
    scenarios: {
        // 1️ CENÁRIO: CARGA NORMAL (uso esperado)
        carga_normal: {
            executor: "ramping-vus",
            startVUs: 1,
            stages: [
                { duration: "20s", target: 20 },
                { duration: "40s", target: 100 },
                { duration: "1m", target: 200 },
                { duration: "20s", target: 0 },
            ],
            exec: "cargaNormal",
        },

        // 2️ CENÁRIO: PICO (spike test)
        spike: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "5s", target: 200 },  // sobe muito rápido
                { duration: "10s", target: 0 },
            ],
            exec: "pico",
        },

        // 3️ CENÁRIO: STRESS PROGRESSIVO
        stress_progressivo: {
            executor: "ramping-vus",
            startVUs: 0,
            stages: [
                { duration: "30s", target: 50 },
                { duration: "30s", target: 100 },
                { duration: "30s", target: 200 },
                { duration: "30s", target: 400 },
                { duration: "20s", target: 0 },
            ],
            exec: "stressProgressivo",
        },

        // 4️ CENÁRIO: CONCORRÊNCIA EM /emprestimo (transação crítica)
        concorrencia_emprestimo: {
            executor: "constant-arrival-rate",
            rate: 40,          // 40 requisições por segundo
            timeUnit: "1s",
            duration: "1m",
            preAllocatedVUs: 50,
            maxVUs: 150,
            exec: "fluxoEmprestimo",
        },

        // 5️ CENÁRIO: FLUXO COMPLETO (E2E)
        fluxo_completo: {
            executor: "per-vu-iterations",
            vus: 20,
            iterations: 10,
            exec: "fluxoCompleto",
        },

        // 6️ CENÁRIO: RESISTÊNCIA (Soak Test)
        resistencia: {
            executor: "constant-vus",
            vus: 30,
            duration: "20m",
            exec: "cargaNormal",
        }
    },

    thresholds: {
        'http_req_duration': ['p(95)<500'],
        'http_req_failed': ['rate<0.25'],
    }
};

// ======================================================================
// FUNÇÕES EXECUTADAS PELOS CENÁRIOS
// ======================================================================

// 1️ Uso normal (sua função original, com os 3 tipos de requisições)
export function cargaNormal() {
    const scenario = Math.random();

    if (scenario < 0.5) {
        const res = http.get(routes.livros);
        check(res, { 'GET /livros status 200': (r) => r.status === 200 });
        metrics.requests.add(res.timings.duration);
    }
    else if (scenario < 0.8) {
        const res = http.get(`${routes.pessoas}/0166d1e7-e40e-4e77-974f-60782a9da273`);
        check(res, {
            'GET /pessoas status 200 ou 404': (r) =>
                r.status === 200 || r.status === 404,
        });
        metrics.requests.add(res.timings.duration);
    }
    else {
        const payload = JSON.stringify({
            pessoaId: '0166d1e7-e40e-4e77-974f-60782a9da273',
            livroId: '0478b2f4-4473-4a58-9eb0-a875881f6e4d',
            dataEmprestimo: new Date().toISOString(),
        });

        const params = { headers: { 'Content-Type': 'application/json' } };

        const res = http.post(routes.emprestimo, payload, params);
        check(res, {
            'POST /emprestimo 201 ou 400': (r) =>
                r.status === 201 || r.status === 400,
        });
        metrics.requests.add(res.timings.duration);
    }

    sleep(1);
}

// 2️ Pico súbito (somente GET livros)
export function pico() {
    const res = http.get(routes.livros);
    metrics.requests.add(res.timings.duration);
    sleep(0.2);
}

// 3️ Stress progressivo (GET livros + GET pessoa)
export function stressProgressivo() {
    const res1 = http.get(routes.livros);
    const res2 = http.get(`${routes.pessoas}/0166d1e7-e40e-4e77-974f-60782a9da273`);
    metrics.requests.add(res1.timings.duration);
    metrics.requests.add(res2.timings.duration);
    sleep(0.5);
}

// 4️ Concorrência mássiva no empréstimo
export function fluxoEmprestimo() {
    const payload = JSON.stringify({
        pessoaId: '0166d1e7-e40e-4e77-974f-60782a9da273',
        livroId: '0478b2f4-4473-4a58-9eb0-a875881f6e4d',
        dataEmprestimo: new Date().toISOString(),
    });
    const params = { headers: { 'Content-Type': 'application/json' } };
    const res = http.post(routes.emprestimo, payload, params);
    metrics.requests.add(res.timings.duration);
}

// 5️ Fluxo completo da aplicação
export function fluxoCompleto() {
    http.get(routes.livros);
    http.get(`${routes.pessoas}/0166d1e7-e40e-4e77-974f-60782a9da273`);

    const payload = JSON.stringify({
        pessoaId: '0166d1e7-e40e-4e77-974f-60782a9da273',
        livroId: '0478b2f4-4473-4a58-9eb0-a875881f6e4d',
        dataEmprestimo: new Date().toISOString(),
    });

    const params = { headers: { 'Content-Type': 'application/json' } };
    http.post(routes.emprestimo, payload, params);

    sleep(1);
}
