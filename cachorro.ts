export class Cachorro {
  constructor(private nome: string) {}
  
  public latir(vezes: number) {
    return `${this.nome} latiu ${vezes}x: au!`.trim();
  }
}