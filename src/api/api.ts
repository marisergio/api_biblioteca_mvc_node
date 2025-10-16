import express, { Express, Request, Response } from "express"
import cors from "cors";


export class Api {
    private constructor(readonly app: Express) { }

    public static build() {
        const app = express()
        app.use(cors());
        app.use(express.json())
        return new Api(app)
    }

    public start() {
        this.app.listen(3000, () => {
            console.log("Server runing.")
        })
    }

    public addRota(rota: string, metodo: string, funcao: (request: Request, response: Response) => void): void {
        if (metodo === "POST") {
            this.app.post(rota, funcao)
        } else if (metodo === "GET") {
            this.app.get(rota, funcao)
        } else if (metodo === "DELETE") {
            this.app.delete(rota, funcao)
        }else if(metodo==="PUT"){
            this.app.put(rota, funcao)
        }else if(metodo==="PATCH"){
            this.app.patch(rota,funcao)
        }
    }

}