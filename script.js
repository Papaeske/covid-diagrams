const apiUrl = "https://api.covid19api.com/summary";

const chartData = {
  labels: ["Confirmed", "Deaths"],
  datasets: [
    {
      label: "COVID-19 Stats",
      data: [0, 0, 0],
      backgroundColor: ["#ff8c00", "#dc143c", "#32cd32"],
    },
  ],
};

const chartConfig = {
  type: "bar",
  data: chartData,
  options: {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
          },
        },
      ],
    },
    title: {
      display: true,
      text: "COVID-19 Stats",
    },
  },
};

const countrySelect = document.getElementById("country-select");

window.addEventListener("load", function () {
  const chartCanvas = document.getElementById("chart").getContext("2d");
  const chart = new Chart(chartCanvas, chartConfig);

  // Load global data on page load
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      chart.data.datasets[0].data = [
        data.Global.TotalConfirmed,
        data.Global.TotalDeaths,
        data.Global.TotalRecovered,
      ];
      chart.update();
    })
    .catch((error) => console.error(error));

  countrySelect.addEventListener("change", function () {
    const selectedCountry = countrySelect.value;
    const apiUrlWithCountry = selectedCountry === "global" ? apiUrl : `${apiUrl}?country=${selectedCountry}`;

    fetch(apiUrlWithCountry)
      .then((response) => response.json())
      .then((data) => {
        const countryData = selectedCountry === "global" ? data.Global : data.Countries.find((c) => c.Country === selectedCountry);
        chart.data.datasets[0].data = [
          countryData.TotalConfirmed,
          countryData.TotalDeaths,
          countryData.TotalRecovered,
        ];
        chart.options.title = { text: `COVID-19 Stats for ${selectedCountry}` };
        chart.update();
      })
      .catch((error) => console.error(error));
  });

  // Load country options into dropdown
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const countryOptions = data.Countries.map((c) => `<option value="${c.Country}">${c.Country}</option>`);
      countrySelect.innerHTML += countryOptions.join("");
    })
    .catch((error) => console.error(error));
});