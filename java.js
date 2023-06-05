var indicatorsSelect = document.getElementById('indicator-select');
var indicatorValue = document.getElementById('indicator-value');
var chartContainer = document.getElementById('chart-container');
var chart = null;
var selectedDate = null; // Variable para almacenar la fecha seleccionada

fetch('https://mindicador.cl/api')
  .then(function(response) {
    return response.json();
  })
  .then(function(dailyIndicators) {
    for (const key in dailyIndicators) {
      const option = document.createElement('option');
      option.value = key;
      option.textContent = dailyIndicators[key].nombre;
      indicatorsSelect.appendChild(option);
    }
  })
  .catch(function(error) {
    console.log('Request failed', error);
  });

indicatorsSelect.addEventListener('change', function() {
  var selectedIndicator = this.value;
  fetchData(selectedIndicator, selectedDate); // Mostrar información al cambiar la moneda seleccionada
});

function fetchData(selectedIndicator, selectedDate) {
  var url = 'https://mindicador.cl/api/' + selectedIndicator;

  if (selectedDate) {
    var formattedDate = formatDate(selectedDate);
    url += '/' + formattedDate;
  }

  fetch(url)
    .then(function(response) {
      return response.json();
    })
    .then(function(indicatorData) {
      var values = indicatorData.serie.map(function(data) {
        return data.valor;
      });

      var min = Math.min(...values);
      var max = Math.max(...values);
      var sum = values.reduce(function(acc, val) {
        return acc + val;
      }, 0);
      var average = sum / values.length;

      var indicatorInfo = `
        <h2>${indicatorData.nombre}</h2>
        <p>Fecha desde: ${indicatorData.serie[0].fecha}</p>
        <p>Valor actual: ${indicatorData.serie[indicatorData.serie.length - 1].valor} ${indicatorData.unidad_medida}</p>
        <p>Mínimo: ${min}</p>
        <p>Máximo: ${max}</p>
        <p>Promedio: ${average.toFixed(2)}</p>
      `;

      indicatorValue.innerHTML = indicatorInfo;

      if (chart) {
        chart.destroy();
      }

      var ctx = chartContainer.getContext('2d');
      chart = new Chart(ctx, {
        type: 'line',
        data: {
          labels: indicatorData.serie.map(function(data) {
            return data.fecha;
          }),
          datasets: [
            {
              label: 'Valor',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          aspectRatio: 0.5, // Ajusta este valor para reducir el tamaño del gráfico
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      });
    })
    .catch(function(error) {
      console.log('Request failed', error);
    });
}
function formatDate(date) {
  var year = date.getFullYear();
  var month = ('0' + (date.getMonth() + 1)).slice(-2);
  var day = ('0' + date.getDate()).slice(-2);
  return year + '-' + month + '-' + day;
}


