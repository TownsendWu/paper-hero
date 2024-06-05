const data = [1, 2, 3, 4, 5, 6, 7, 8, 9]

let index = 0
for (let i = 0; i < 3; i++) {
    for (let j = 0; j < 3; j++) {
        console.log(data[i * 3 + j]);
    }
}