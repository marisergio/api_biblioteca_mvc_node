import http from 'k6/http';
import { check, sleep } from 'k6';
//usada para armazenar tempos (latência, duração etc.)
import { Trend } from 'k6/metrics';

// Você pode usar: BASE_URL=http://localhost:3000 k6 run load_test.js
const BASE_URL = __ENV.BASE_URL || 'http://localhost:3000';

export let options = {
    stages: [
        { duration: 's', target: 20 },   // rampa para 20 usuários
        { duration: '40s', target: 100 },  // aumenta para 100 usuários
        { duration: '1m', target: 200 },   // mantém 200 usuários por 1 min
        { duration: '20s', target: 0 },    // reduz
    ],
    //condições para o teste ser considerado aprovado
    thresholds: {
        'http_req_duration': ['p(95)<500'], // 95% das req abaixo de 500ms
        'http_req_failed': ['rate<0.25'],   // até 25% de erro é tolerável
    },
};

const metrics = {
    //Cria uma métrica chamada requests_duration_ms
    requests: new Trend('requests_duration_ms'),
};

const routes = {
    livros: `${BASE_URL}/livros`,
    pessoas: `${BASE_URL}/pessoas`,
    emprestimo: `${BASE_URL}/emprestimo`,
};

export default function () {
    //Usado para dividir o tráfego de forma proporcional.
    const scenario = Math.random();

    if (scenario < 0.5) {
        // 50% das requisições → GET /livro
        const res = http.get(routes.livros);
        check(res, { 'GET /livros status 200': (r) => r.status === 200 });
        metrics.requests.add(res.timings.duration);
    }
    else if (scenario < 0.8) {
        // 30% → GET /pessoa/1 (ou 404, se não existir)
        const res = http.get(`${routes.pessoas}/0166d1e7-e40e-4e77-974f-60782a9da273`);
        check(res, {
            'GET /pessoas/0166d1e7-e40e-4e77-974f-60782a9da273 200 ou 404': (r) => r.status === 200 || r.status === 404,
        });
        metrics.requests.add(res.timings.duration);
    }
    else {
        // 20% → POST /emprestimo
        const payload = JSON.stringify({
            pessoaId: '0166d1e7-e40e-4e77-974f-60782a9da273',
            livroId: '0478b2f4-4473-4a58-9eb0-a875881f6e4d',
            dataEmprestimo: new Date().toISOString(),
        });

        const params = { headers: { 'Content-Type': 'application/json' } };

        const res = http.post(routes.emprestimo, payload, params);
        check(res, {
            'POST /emprestimo status 201/400': (r) => r.status === 201 || r.status === 400,
        });

        metrics.requests.add(res.timings.duration);
    }

    sleep(1);
}