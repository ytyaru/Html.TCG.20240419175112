class Master {
    constructor(id, name, life) {
        this.id = id
        this.name = name
        this.life = life
        this.skills = []
        this.decks = []
    }
}
class Holder {
    constructor() {
        this.id = 0
        this.num = 3
        this.decks = []
    }
}
class Deck {
    constructor() {
        this.id = 0
        this.num = 10
        this.cards = []
    }
    suffule() {}
}

const mst1 = new Master(0, '主A', 10)
const mst2 = new Master(0, '主B', 10)
for (let i=0; i<10; i++) { mst1.decks.push(c1) }
for (let i=0; i<10; i++) { mst2.decks.push(c2) }
