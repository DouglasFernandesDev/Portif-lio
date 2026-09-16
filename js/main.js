// Ponto de entrada. Carregado como <script type="module">, portanto
// adiado por padrão: o DOM já está pronto quando este código roda.

import { iniciarMenu } from './modules/menu.js';
import { iniciarFormularioWhatsapp } from './modules/formulario-whatsapp.js';
import { iniciarEfeitoDigitando } from './modules/efeito-digitando.js';
import { iniciarRevelarScroll } from './modules/revelar-scroll.js';
import { iniciarAnoRodape } from './modules/ano-rodape.js';
import { iniciarConsentimentoCookies } from './modules/consentimento-cookies.js';

iniciarMenu();
iniciarFormularioWhatsapp();
iniciarEfeitoDigitando();
iniciarRevelarScroll();
iniciarAnoRodape();
iniciarConsentimentoCookies();
