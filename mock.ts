// Um objeto qualquer (classe ou instância) que será mockado
type ObjetoAlvo = { [chave: string]: any };

// Estrutura que guarda a implementação original antes do mock
type RegistroMock = {
    alvo: ObjetoAlvo;
    metodo: string;
    original: Function;
};

/**
 * Classe utilitária para demonstrar como funciona o mecanismo de mock.
 * 
 * Permite:
 *  - Substituir um método por um retorno fixo (mockarRetorno)
 *  - Substituir um método por uma função custom (mockarFuncionalidade)
 *  - Restaurar a implementação original (restaurar / restaurarTodos)
 * 
 * OBS: Isso é apenas para fins didáticos, não é um framework de testes real.
 */
export class Mock {
    private static registros: RegistroMock[] = [];

    /** Procura no array de registros se já existe mock para esse alvo+método */
    private static acharRegistro(alvo: ObjetoAlvo, metodo: string): number {
        return this.registros.findIndex(
            (reg) => reg.alvo === alvo && reg.metodo === metodo
        );
    }

    /** Salva a implementação original do método, se ainda não foi salvo */
    private static salvarOriginal(alvo: ObjetoAlvo, metodo: string) {
        if (this.acharRegistro(alvo, metodo) !== -1) return;

        const impl = alvo[metodo];
        if (typeof impl === "function") {
            this.registros.push({ alvo, metodo, original: impl });
        }
    }

    /**
     * Mocka um método para sempre retornar um valor fixo.
     * 
     * @param alvo Objeto ou classe que contém o método
     * @param metodo Nome do método
     * @param valor Valor fixo a ser retornado
     */
    static mockarRetorno(alvo: ObjetoAlvo, metodo: string, valor: any): void {
        this.salvarOriginal(alvo, metodo);
        alvo[metodo] = () => valor;
    }

    /**
     * Mocka um método substituindo pela função fornecida.
     * 
     * @param alvo Objeto ou classe que contém o método
     * @param metodo Nome do método
     * @param fn Função que será usada no lugar da original
     */
    static mockarFuncionalidade(alvo: ObjetoAlvo, metodo: string, fn: Function): void {
        this.salvarOriginal(alvo, metodo);
        alvo[metodo] = function (...args: any[]) {
            return fn.apply(this, args);
        };
    }

    /**
     * Restaura a implementação original de um método mockado.
     */
    static restaurar(alvo: ObjetoAlvo, metodo: string): void {
        const idx = this.acharRegistro(alvo, metodo);
        if (idx === -1) return;

        const { original } = this.registros[idx];
        alvo[metodo] = original;
        this.registros.splice(idx, 1);
    }

    /**
     * Restaura todas as implementações originais que foram mockadas.
     */
    static restaurarTodos(): void {
        for (const { alvo, metodo, original } of this.registros) {
            alvo[metodo] = original;
        }
        this.registros = [];
    }
}
