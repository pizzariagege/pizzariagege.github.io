(() => {
  'use strict';

  // Inicializar validação personalizada do Bootstrap
  const forms = document.querySelectorAll('.needs-validation');

  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault();
        event.stopPropagation();
      } else {
        event.preventDefault(); // Previne o envio padrão para executar a lógica customizada

        const formData = new FormData(form);

        if (!dadosCliente) {
          dadosCliente = {
            nome: formData.get('nome'),
            telefone: formData.get('telefone'),
            endereco: formData.get('endereco'),
            referencia: formData.get('referencia'),
            entrega: formData.get('entrega'),
            pagamento: formData.get('pagamento')
          };
        }

        const pedido = {
          tamanho: formData.get('tamanho'),
          sabor1: formData.get('sabor1'),
          sabor2: formData.get('sabor2'),
          borda: formData.get('borda'),
          refrigerante: Array.from(formData.getAll('refrigerante')).join(', ') || 'Nenhum',
          observacoes: formData.get('observacoes')
        };

        pedidos.push(pedido);

        atualizarModal();
        limparCamposPedido();

        const pedidoModal = new bootstrap.Modal(document.getElementById('pedidoModal'));
        pedidoModal.show();
      }
      form.classList.add('was-validated');
    }, false);
  });

  const pedidos = [];
  let dadosCliente = null;

  // Mostrar ou ocultar o campo "Sabor 2" com base no tamanho do pedido
  document.getElementById('tamanho').addEventListener('change', function () {
    const tamanho = this.value;
    const sabor2Container = document.getElementById('sabor2-container');
    const sabor2Field = document.getElementById('sabor2');

    if (['grande', 'família'].includes(tamanho)) {
      sabor2Container.style.display = 'block';
      sabor2Field.required = true;
    } else {
      sabor2Container.style.display = 'none';
      sabor2Field.required = false;
    }
  });

  // Mostrar ou ocultar o campo "Endereço" com base na escolha de entrega
  document.querySelectorAll('input[name="entrega"]').forEach(radio => {
    radio.addEventListener('change', function () {
      const enderecoContainer = document.getElementById('endereco-container');
      const enderecoField = document.getElementById('endereco');

      const referenciaField = document.getElementById('referencia');

      if (this.value === 'entrega') {
        enderecoContainer.style.display = 'block';
        enderecoField.required = true;

        referenciaField.required = true;
      } else {
        enderecoContainer.style.display = 'none';
        enderecoField.required = false;

        referenciaField.required = false;
      }
    });
  });

  // Lógica para envio do formulário
  //document.getElementById('pedido-form').addEventListener('submit', function (e) {
  //  e.preventDefault();


  //});

  // Atualizar modal com os dados do cliente e pedidos
  function atualizarModal() {
    const modalBody = document.getElementById('pedidoModalBody');

    const clienteHTML = `
      <h5>Dados do Cliente</h5>
      <strong>Nome:</strong> ${dadosCliente.nome}<br>
      <strong>Telefone:</strong> ${dadosCliente.telefone}<br>
      ${dadosCliente.endereco ? `<strong>Endereço:</strong> ${dadosCliente.endereco}<br>` : ''}
      ${dadosCliente.referencia ? `<strong>Referência:</strong> ${dadosCliente.referencia}<br>` : ''}
      <strong>Retirada/Entrega:</strong> ${dadosCliente.entrega}<br>
      <strong>Pagamento:</strong> ${dadosCliente.pagamento}<br>
      <hr>
    `;

    const pedidosHTML = pedidos.map((pedido, index) => `
      <strong>Pedido ${index + 1}:</strong><br>
      Tamanho: ${pedido.tamanho}<br>
      Sabor 1: ${pedido.sabor1}<br>
      ${pedido.sabor2 ? `Sabor 2: ${pedido.sabor2}<br>` : ''}
      Borda: ${pedido.borda}<br>
      Refrigerante: ${pedido.refrigerante}<br>
      Observações: ${pedido.observacoes || 'Nenhuma'}<br>
      <hr>
    `).join('');

    modalBody.innerHTML = clienteHTML + pedidosHTML;
  }

  // Limpar campos do formulário para novos pedidos
  function limparCamposPedido() {
    document.getElementById('tamanho').value = '';
    document.getElementById('sabor1').value = '';
    document.getElementById('sabor2').value = '';
    document.getElementById('borda').value = '';
    document.querySelectorAll('input[name="refrigerante"]').forEach(input => input.checked = false);
    document.getElementById('observacoes').value = '';
  }

  // Finalizar o pedido e enviar pelo WhatsApp
  document.getElementById('finalizarPedido').addEventListener('click', function () {

    const pedidoForm = document.getElementById('pedido-form');
    const whatsNumber = pedidoForm.getAttribute('data-w-number'); //atribua o número na tag form

    const mensagemCliente = `*Dados do Cliente:*
*Nome:* ${dadosCliente.nome}
*Telefone:* ${dadosCliente.telefone} ${dadosCliente.endereco ? `\n*Endereço:* ${dadosCliente.endereco}` : '' } ${dadosCliente.referencia ? `\n*Referência:* ${dadosCliente.referencia}` : '' }
*Retirada/Entrega:* ${dadosCliente.entrega}
*Pagamento:* ${dadosCliente.pagamento}`
    ;

    const mensagemPedidos = pedidos.map((pedido, index) => `
*Pedido ${index + 1}:*
*Tamanho:* ${pedido.tamanho}
*Sabor 1:* ${pedido.sabor1} ${pedido.sabor2 ? `\n*Sabor 2:* ${pedido.sabor2}` : ''}
*Borda:* ${pedido.borda}
*Refrigerante:* ${pedido.refrigerante}
*Observações:* ${pedido.observacoes || 'Nenhuma'}`
    ).join('\n');

    const mensagemFinal = mensagemCliente + '\n' + mensagemPedidos;

    const url = `https://wa.me/55${whatsNumber}?text=${encodeURIComponent(mensagemFinal)}`;
    window.open(url, '_blank');

    pedidos.length = 0;
    dadosCliente = null;
    const pedidoModal = bootstrap.Modal.getInstance(document.getElementById('pedidoModal'));
    pedidoModal.hide();
    document.getElementById('pedido-form').reset();
  });
})();

