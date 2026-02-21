document.addEventListener("DOMContentLoaded", function () {

    const form = document.querySelector("form");
    const tipoViagem = document.getElementsByName("tipo");
    const dataVoltaContainer = document.getElementById("campo-volta");
    const dataVoltaInput = document.getElementById("data-volta");
    const dataIdaInput = document.getElementById("data-ida");
    const resultadoSection = document.getElementById("resultado");

    const ANO_INICIAL = 2026;

    /* ===============================
       CONFIGURAR DATAS (ANO FIXO 2026+)
    =============================== */

    const hoje = new Date(`${ANO_INICIAL}-01-01`);
    const dataMin = hoje.toISOString().split("T")[0];

    dataIdaInput.min = dataMin;
    dataVoltaInput.min = dataMin;

    /* ===============================
       CONTROLAR IDA / VOLTA
    =============================== */

    tipoViagem.forEach(radio => {
        radio.addEventListener("change", function () {
            if (this.value === "so-ida") {
                dataVoltaContainer.style.display = "none";
                dataVoltaInput.value = "";
            } else {
                dataVoltaContainer.style.display = "block";
            }
        });
    });

    /* ===============================
       SIMULAÇÃO DE PREÇOS
    =============================== */

    function calcularPreco(destino, mes, passageiros) {

        let precoBase = 400;

        const adicionaisDestino = {
            "São Paulo": 200,
            "Rio de Janeiro": 250,
            "Salvador": 180,
            "Fortaleza": 150,
            "Lisboa": 900,
            "Paris": 1200
        };

        if (adicionaisDestino[destino]) {
            precoBase += adicionaisDestino[destino];
        }

        // Alta temporada (junho e julho)
        if (mes == 6 || mes == 7) {
            precoBase += 300;
        }

        return precoBase * passageiros;
    }

    /* ===============================
       BUSCAR VOOS
    =============================== */

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const origem = document.getElementById("origem").value;
        const destino = document.getElementById("destino").value;
        const dataIda = dataIdaInput.value;
        const dataVolta = dataVoltaInput.value;
        const passageiros = parseInt(document.getElementById("passageiros").value);
        const tipoSelecionado = document.querySelector('input[name="tipo"]:checked').value;

        // Validações
        if (origem === destino) {
            alert("Origem e destino não podem ser iguais.");
            return;
        }

        if (!dataIda) {
            alert("Selecione a data de ida.");
            return;
        }

        if (tipoSelecionado === "ida-volta" && !dataVolta) {
            alert("Selecione a data de volta.");
            return;
        }

        if (tipoSelecionado === "ida-volta" && dataVolta < dataIda) {
            alert("Data de volta não pode ser antes da ida.");
            return;
        }

        const mesIda = new Date(dataIda).getMonth() + 1;
        const precoFinal = calcularPreco(destino, mesIda, passageiros);

        /* ===============================
           MOSTRAR RESULTADOS
        =============================== */

        resultadoSection.innerHTML = `
            <div class="card-voo">
                <h3>${origem} → ${destino}</h3>
                <p><strong>Ida:</strong> ${dataIda}</p>
                ${tipoSelecionado === "ida-volta" ? `<p><strong>Volta:</strong> ${dataVolta}</p>` : ""}
                <p><strong>Passageiros:</strong> ${passageiros}</p>
                <p class="preco">Total: R$ ${precoFinal.toFixed(2)}</p>
            </div>
        `;
    });

});