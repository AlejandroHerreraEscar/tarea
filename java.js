var indicatorsSelect = document.getElementById('indicator-select');

fetch('https://mindicador.cl/api')
  .then(function(response) {
    return response.json();
  })
  .then(function(dailyIndicators) {
    document.getElementById("UF").innerHTML = 'El valor actual de la UF es $' + dailyIndicators.uf.valor;
    document.getElementById("DolarO").innerHTML = 'El valor actual del Dólar observado es $' + dailyIndicators.dolar.valor;
    document.getElementById("DolarA").innerHTML = 'El valor actual del Dólar acuerdo es $' + dailyIndicators.dolar_intercambio.valor;
    document.getElementById("Euro").innerHTML = 'El valor actual del Euro es $' + dailyIndicators.euro.valor;
    document.getElementById("IPC").innerHTML = 'El valor actual del IPC es ' + dailyIndicators.ipc.valor + '%';
    document.getElementById("UTM").innerHTML = 'El valor actual de la UTM es $' + dailyIndicators.utm.valor;
    document.getElementById("IVP").innerHTML = 'El valor actual del IVP es $' + dailyIndicators.ivp.valor;
    document.getElementById("Imacec").innerHTML = 'El valor actual del Imacec es ' + dailyIndicators.imacec.valor + '%';
  })
  .catch(function(error) {
    console.log('Request failed', error);
  });

axios.get('https://mindicador.cl/api')
  .then(function(response) {
    const indicators = response.data;
    for (const key in indicators) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = indicators[key].nombre;
      indicatorsSelect.appendChild(option);
    }
  });

indicatorsSelect.addEventListener('change', function() {
  buscar_moneda(this.value);
});

function buscar_moneda(option) {
  console.log(option);
}

