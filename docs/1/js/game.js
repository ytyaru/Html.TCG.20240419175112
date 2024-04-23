class Game {
    constructor() { // areas, rules
        this.areas = [] // 各陣（自陣、敵陣）
        this.rules = []
    }
    setup() { // 開
        // 先攻・後攻を決める
        // 使用デッキを山札に配置する
        // 山札から手札を引く
        for (let area of this.areas) {
            area.stock = area.master.decks[0]
            for (let i=0; i<3; i++) {
                area.hands.push(area.stock.pop())
            }
        }
    }
    run() { // 始,備,動,終
        //const phase = new Phase(this.areas, this.rules)
        //phase.run()
        const turn = new Turn(this.areas, this.rules)
        turn.run()
    }
    end() { // 閉
        // 勝敗判定・通知
    }
}
class Turn {
    constructor(areas) {
        this.areas = areas
        this.phases = [new StartPhase(), new SetupPhase(), new ActPhase(), new EndPhase()]
        this.turns = 0
        this.phase = -1
        this.side = -1
    }
    run() {
        this.turns++
        //const side = Math.floor(this.turns/2) // 0:先攻の番, 1:後攻の番
        this.side = this.turns % 2 // 0:先攻の番, 1:後攻の番
        const attacker = this.areas[ this.side]
        const defender = this.areas[!this.side]
        for (let phase of this.phases) {
            phase.run(turns, side, attacker, defender)
            this.phase++
        }
    }
}
class Phase {
    constructor(name) { this.name = name; }
    start(turns, side, attacker, defender, append='') {
        console.log(`${turns}回目 ${((0===side) ? '先' : '後')} ${this.name}${((''===append) ? '' : append)}`)
    }
}
class StartPhase extends Phase { // 始
    constructor() { super('始') }
    run(turns, side, attacker, defender) {
        super.start(turns, side, attacker, defender)
//        console.log(`${turns}回目 ${((0===side) ? '先' : '後')} 始`)
    }
}
class SetupPhase extends Phase { // 備
    constructor() { super('備') }
    run(turns, side, attacker, defender) {
        this.#draw(turns, side, attacker, defender)
        this.#put(turns, side, attacker, defender)
        this.#swap(turns, side, attacker, defender)
    }
    #draw(turns, side, attacker, defender) { // 山札から一枚引き手札に加える
        super.start(turns, side, attacker, defender, 'DRAW')
//        console.log(`${turns}回目 ${((0===side) ? '先' : '後')} 備 DRAW`)
        attacker.hands.push(attacker.stocks.pop())
    }
    #put(turns, side, attacker, defender) { // 手札から戦場に一枚出す
        super.start(turns, side, attacker, defender, 'PUT')
//        console.log(`${turns}回目 ${((0===side) ? '先' : '後')} 備 PUT`)
        if (0===attacker.hands.length) { return } // 手札があれば
        for (let field of attacker.fields) {
            if (0===field.servants.length) { // この席が空なら
                field.servants.push(attacker.hands.pop()) // この席に手札を配置する
            }
        }
    }
    #swap(turns, side, attacker, defender) {
        super.start(turns, side, attacker, defender, 'SWAP')
//        console.log(`${turns}回目 ${((0===side) ? '先' : '後')} 備 SWAP`)
    }
}
class ActPhase extends Phase { // 動
    constructor() { super('動') }
    run(turns, side, attacker, defender) {
        super.start(turns, side, attacker, defender)
//        console.log(`${turns}回目 ${((0===side) ? '先' : '後')} 動`)
        for (let f=0; f<attacker.fields.length; f++) {
            const field = attacker.fields[f]
            if (0===field.servants.length) { continue }
            const subject = field.servants[0] // この場にある最上札
            for (let skill of subject.skills) { // 技を実行する
                for (let opponents of skill.getTargets(fturns, side, attacker, defender, f)) { // 相手を得る
                    console.log(`${subject.name}が${skill.name}を実行。`)
                    skill.run(opponents)
                    this.#death(turns, side, attacker, defender)
                }
            }
        }
    }
    death(turns, side, attacker, defender) { // 死亡処理
        for (let f=0; f<defender.fields.length; f++) {
            const field = defender.fields[f]
            if (0===field.servants.length) { continue }
            for (let s=0; s<field.servants.length; s++) {
                if (field.servants[s].life <= 0) { // 死亡
                    console.log(`${field.servants[s].name}は死んだ……`)
                    defender.graves.unshift(field.servants.splice(s,1)) // 死札を墓場の先頭へ移動する
                    s--
                }
            }
        }
    }
}
class EndPhase extends Phase { // 終
    constructor() { super('動') }
    run(turns, side, attacker, defender) {
        super.start(turns, side, attacker, defender)
        //console.log(`${turns}回目 ${((0===side) ? '先' : '後')} 終`)
    }
}
class Rule { // ルール（勝敗引分を決定するルール）
    constructor(areas) {
        this.areas = areas
    }
    judge() { // return -1,0,1
        //for (let area of this.areas) {
        for (let i=0; i<this.areas.length; i++) {
            if (area.master.life <= 0) { return i }
        }
        return -1
    }
}
class Area { // 各陣（自陣、敵陣）
    constructor(master) {
        this.master = master
        this.stocks = [] // 山札
        this.hands = []  // 手札
        this.graves = [] // 墓札
        this.fields = [] // 戦札
    }
}
class Field { // 場
    constructor(master) {
        this.servants = []   // 重ねられた従者札
        this.equipments = [] // 重ねられた装備札
        this.ground = null
    }
}

const area1 = new Area(mst1)
const area2 = new Area(mst2)
for (let i=0; i<3; i++) {
    area1.fields.push(new Field())
    area2.fields.push(new Field())
}
const areas = [area1, area2]
const game = new Game(areas, [new Rule(areas)])
