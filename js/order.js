(() => {
  'use strict'

  // Validação de formulário com Bootstrap
  const forms = document.querySelectorAll('.needs-validation')

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      } else {
        // Continua com a lógica personalizada se o formulário for válido
        event.preventDefault(); // Previne o envio padrão para executar a lógica customizada

        const formData = new FormData(form);
        const pedido = Object.fromEntries(formData.entries());
        const refrigerante = formData.getAll('refrigerante').join(', ');

        const mensagem = `*Pedido de Pizza*%0A%0A` +
          `*Tamanho:* ${pedido.tamanho}%0A` +
          `*Sabor 1:* ${pedido.sabor1}%0A` +
          (pedido.sabor2 ? `*Sabor 2:* ${pedido.sabor2}%0A` : '') +
          `*Borda:* ${pedido.borda}%0A` +
          (refrigerante ? `*Refri:* ${refrigerante}%0A` : '') +
          `*Entrega ou Retirada:* ${pedido.entrega}%0A` +
          `*Nome:* ${pedido.nome}%0A` +
          `*Telefone:* ${pedido.telefone}%0A` +
          (pedido.endereco ? `*Endereço:* ${pedido.endereco}%0A` : '') +
          `*Pagamento:* ${pedido.pagamento}%0A` +
          (pedido.observacoes ? `*Observações:* ${pedido.observacoes}%0A` : '');

        const numeroWhatsApp = '559984135298'; // Substitua pelo número desejado
        const urlWhatsApp = `https://wa.me/${numeroWhatsApp}?text=${mensagem}`;

        window.open(urlWhatsApp, '_blank');

        setTimeout(() => {
          window.location.href = 'pagina-de-confirmacao.html';
        }, 500);
      }

      form.classList.add('was-validated');
    }, false)
  });

  // Lógica para mostrar/ocultar campos e atualizar requisitos
  document.getElementById('tamanho').addEventListener('change', function () {
    const tamanho = this.value;
    const sabor2Container = document.getElementById('sabor2-container');

    if (tamanho === 'grande' || tamanho === 'familia') {
      sabor2Container.style.display = 'block';
      document.getElementById('sabor2').required = true;
    } else {
      sabor2Container.style.display = 'none';
      document.getElementById('sabor2').required = false;
    }
  });

  document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', function () {
      const enderecoContainer = document.getElementById('endereco-container');

      if (this.value === 'entrega') {
        enderecoContainer.style.display = 'block';
        document.getElementById('endereco').required = true;
      } else {
        enderecoContainer.style.display = 'none';
        document.getElementById('endereco').required = false;
      }
    });
  });
})();

