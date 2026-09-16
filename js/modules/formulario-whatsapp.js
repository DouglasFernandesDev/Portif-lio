// Formulário rápido para o WhatsApp.
// Não existe backend aqui: o formulário só monta um texto e abre o
// WhatsApp com a mensagem já preenchida. Nenhum dado é salvo ou enviado
// a lugar nenhum além do próprio WhatsApp.

const NUMERO_WHATSAPP = '5522998984135';

export function iniciarFormularioWhatsapp() {
  const formulario = document.getElementById('formularioWhatsapp');
  if (!formulario) return;

  const avisoPopupBloqueado = document.getElementById('avisoPopupBloqueado');

  formulario.addEventListener('submit', (e) => {
    e.preventDefault();

    const nome = document.getElementById('nomeContato').value.trim();
    const mensagem = document.getElementById('mensagemContato').value.trim();
    if (!nome || !mensagem) return;

    const texto = `Olá! Me chamo ${nome}. ${mensagem}`;
    const url = `https://wa.me/${NUMERO_WHATSAPP}?text=${encodeURIComponent(texto)}`;

    const novaJanela = window.open(url, '_blank', 'noopener,noreferrer');

    // window.open não lança exceção quando um bloqueador de pop-up
    // intercepta a chamada: ele silenciosamente retorna null (ou, em
    // alguns navegadores, um objeto Window já fechado). Sem essa
    // checagem, o clique no botão simplesmente não faz nada visível
    // e o visitante acha que o site travou.
    if (!novaJanela || novaJanela.closed || typeof novaJanela.closed === 'undefined') {
      if (avisoPopupBloqueado) {
        avisoPopupBloqueado.href = url;
        avisoPopupBloqueado.hidden = false;
      }
    } else if (avisoPopupBloqueado) {
      avisoPopupBloqueado.hidden = true;
    }
  });
}
