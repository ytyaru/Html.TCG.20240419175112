class Card {
    static Kind = {Servant:0, Item:1, Ground:2, Event:3}
    constructor(kind, base, flavour, status, skills) {
        this.kind = kind
        this.base = base
        this.flavour = flavour
        this.status = status
        this.skills = skills
    }
    draw() {

    }
}
class Base {
    constructor(id, name) {
        this.id = id
        this.name = name
    }
}
class Flavour {
    constructor(text) {
        this.text = text 
        // 種族、年齢、性別、職業、身分、性格、思想、見た目
    }
}
class Status {
    constructor(life, width) {
        this.life = life  // 命
        this.width = width // 座席幅
    }
}
class Skill {
    static Type = {
        Attack:0,       // 攻撃
        Reflection:1,   // 反射
        Counter:2,      // 反撃
        Deffence:3,     // 防御
        Avoidance:4,    // 回避
        Absorption:5,   // 吸収
        Recovery:6,     // 回復
        Revival:7,      // 復活
        Strengthen:8,   // 強化
        Weaken:9,       // 弱化
        Restrictions:10,// 行動制限
        CardControll:11,// 札操作
    }
    static Target = { // 座席位置Post、重段位置Page、札種別Kind
        Front:0,       // 正面　　　　　　　　　範囲：正面。対象：一人　　■　
        SideFirst:1,   // 上隣　　　　　　　　　範囲：上。　対象：一人　■　　
        SideLast:2,    // 下隣　　　　　　　　　範囲：下。　対象：一人　　　■
        SideOneF:3,    // 隣一人（上優先）　　　範囲：上下。対象：一人　■　□
        SideOneL:4,    // 隣一人（上優先）　　　範囲：上下。対象：一人　□　■
        SideDouble:5,  // 両隣　　　　　　　　　範囲：上下。対象：二人　■　■
        CenterOneTop:6,// 　　　　　　　　　　　範囲：左右。対象：一人　□□□（123,321,213,312,212,012,210）
    }
    constructor(name, type=Skill.Type.Attack, target=Skill.Target.Front, point=1, rate=100, frequency=1) {
        this.name = name           // 名
        this.type = type           // 種類
        this.target = target       // 対象
        this.point = point         // 点
        this.rate = rate           // 成功率
        this.frequency = frequency // 実行回数
    }
}
class CardDrawer {
    static WIDTH = 16
    draw(card) {
        const lines = []
        lines.push(this.top(this.#toCircleNumber(card.status.width)))
        const items = []
        items.push([card.base.name, card.status.life])
        for (let skill of card.skills) { items.push([skill.name, skill.point]) }
        for (let i of items) { lines.push(this.item(...i)); lines.push(this.middle()); }
        lines.pop()
        lines.push(this.bottom())
        return lines.join('\n')
    }
    top(v=null)    { return ((null===v) ? `┌${this.#line()}┐` : `┌${this.#line(1)}${v}┐`) }
    middle() { return `├${this.#line()}┤` }
    bottom() { return `└${this.#line()}┘` }
    item(name, value) { // type:servent, item, ground, event, skill
        const s = 32 - (name.halfWidthLength() + 2)
        const v = ((value < 10) ? this.#toUpperNumber(value) : value)
        return `│${name}${' '.repeat(s)}${v}│`
    }
    #line(diff=0) { return '─'.repeat(CardDrawer.WIDTH - diff) }
    #toUpperNumber(num) { return `${num}`.replace(/[0-9]/g, (s)=>String.fromCharCode(s.charCodeAt(0) + 0xFEE0)) }
    #toCircleNumber(num) { return String.fromCharCode('①'.charCodeAt(0) + num - 1) } // num:1~20迄対応
}

console.log(Card.Kind)
const c1 = new Card(
    Card.Kind.Servant, 
    new Base(0, '山田太郎'), 
    new Flavour('ただの男。'), 
    new Status(3, 1),
    [new Skill('叩く',Skill.Type.Attack, Skill.Target.Front, 1, 100, 1)])
console.log(c1)

const drawer = new CardDrawer()
console.log(drawer.draw(c1))

