window.onload = function () {
    const data = JSON.parse(localStorage.getItem("ranking")) || [];

    // ORDENA EM ORDEM CRESCENTE
    data.sort((a, b) => b.score - a.score);

    // console.log(data);
    mountRanking(data);
}

function mountRanking([first, second, third, quarterary, five, ...rest]) {
    
    let $tbody = document.getElementById("tbody-ranking");
    const newArray = ([first, second, third, quarterary, five]).filter((elemento) => elemento != undefined);

    let template = "";

    newArray.forEach((elemento, indice) => {
        console.log(elemento);
        template += `
        <tr>
            <td>${indice + 1}</td>
            <td>${elemento.name}</td>
            <td>${elemento.allTime}</td>
            <td>${elemento.questions}</td>
            <td>${elemento.score}</td>
        </tr>
        `
    });

    $tbody.innerHTML = template;
}