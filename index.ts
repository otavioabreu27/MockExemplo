import { Cachorro } from "./cachorro";
import { Calculadora } from "./calculadora";
import { Mock } from "./mock";

// --- Antes do mock ---
console.log("Real:", Calculadora.somar(2, 3));      // 5
console.log("Real:", Calculadora.subtrair(7, 4));   // 3

// --- Mock: sempre retornar um valor fixo ---
Mock.mockarRetorno(Calculadora, "somar", 42);
Mock.mockarRetorno(Calculadora, "subtrair", -999);

console.log("Mock:", Calculadora.somar(2, 3));      // 42
console.log("Mock:", Calculadora.subtrair(7, 4));   // -999

// --- Restaurar e voltar ao comportamento original ---
Mock.restaurar(Calculadora, "somar");
Mock.restaurar(Calculadora, "subtrair");

console.log("Restaurado:", Calculadora.somar(2, 3));    // 5
console.log("Restaurado:", Calculadora.subtrair(7, 4)); // 3


const rex = new Cachorro("Rex");

// --- Antes do mock ---
console.log("Real:", rex.latir(2)); // "Rex latiu 2x: au!"

// --- Mock: substitui por função customizada ---
// Aqui conseguimos usar os argumentos e até 'this' se precisarmos
Mock.mockarFuncionalidade(rex as any, "latir", (vezes: number) => {
  return `*mock* latidos=${vezes}`;
});

console.log("Mock:", rex.latir(3)); // "*mock* latidos=3"

// --- Restaurar ---
Mock.restaurar(rex as any, "latir");
console.log("Restaurado:", rex.latir(1)); // "Rex latiu 1x: au!"