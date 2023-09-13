function A() {
    this.name = 'A'
}

A.prototype.fn = () => {

    console.log('%c [  ]-7', 'font-size:13px; background:pink; color:#bf2c9f;', this, 'A')
}


function B() {
    this.name = 'B'
}

B.prototype.fn = () => {
    console.log('%c [  ]-17', 'font-size:13px; background:pink; color:#bf2c9f;', this, 'B')
}

B.prototype = new A()

// B.prototype.constructor = B

let b = new B()

b.fn()
console.log('%c [  ]-17', 'font-size:13px; background:pink; color:#bf2c9f;', b)