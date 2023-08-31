console.log('promise demo')

const STATUS = {
    0: 'pending',
    1: 'fulfilled',
    2: 'rejected',
}

function IsFunction(param) {
    return typeof param === 'function'
}
const FePromise = function(callback) {
    this.index = 0;
    this.PromiseState = STATUS[0]
    this.PromiseResult = undefined
    this.resolveCallbackList = []
    this.rejectCallbackList = []
    this.catchCallbackList = []

    if (IsFunction(callback)) {

        callback((resolve) => {
            if (this.PromiseState === STATUS[0]) {
                this.PromiseState = STATUS[1]
                this.PromiseResult = resolve
                requestAnimationFrame(this.exec.bind(this))
            }

        }, (reject) => {
            if (this.PromiseState === STATUS[0]) {
                this.PromiseState = STATUS[2]
                this.PromiseResult = reject
                requestAnimationFrame(this.exec.bind(this))
            }

        })
    } else {
        throw ('arguments is not a function')
    }
}
FePromise.prototype.constructor = FePromise
FePromise.prototype = {
    then: function(resolveCb, rejectCb) {
        if (IsFunction(resolveCb)) {
            this.resolveCallbackList.push({ index: this.index, cb: resolveCb })
        }
        if (IsFunction(rejectCb)) {
            this.rejectCallbackList.push({ index: this.index, cb: rejectCb })
        }
        this.index += 1;
        return this
    },
    catch: function(catchCb) {
        if (IsFunction(catchCb)) {
            this.catchCallbackList.push(catchCb)
        }
        return this
    },
    exec: function() {
        if (this.PromiseState !== STATUS[0]) {
            if (this.PromiseState === STATUS[1]) {
                let valueFlag = true
                this.resolveCallbackList.forEach(({ cb }) => {
                    cb(valueFlag ? this.PromiseResult : undefined)
                    valueFlag = false
                });
            } else {
                let [catchCb] = this.catchCallbackList
                IsFunction(catchCb) && catchCb(this.PromiseResult)

                let [{ index, cb: rejectCb }] = this.rejectCallbackList
                IsFunction(rejectCb) && rejectCb(this.PromiseResult)

                this.resolveCallbackList.slice(++index).forEach(resolveCb => {
                    resolveCb(undefined)
                });
            }
        }
    }
}


const p = new FePromise((resolve, reject) => {
    setTimeout(() => {
        resolve(4567)
    }, 0)
    resolve(456)
    reject(445566)

    // setTimeout(() => {
    //     reject(4567)
    // }, 10)

    // reject(4567)
})
p.then(e => {
    console.log('then: ', e);
}).then(e => {
    console.log('then2: ', e);
}).then(e => {
    console.log('then3: ', e);
}, (e) => {
    console.log('then3: reject', e);
})
p.catch(e => {
    console.log('catch: ', e);
}).catch(e => {
    console.log('catch2: ', e);
}).catch(e => {
    console.log('catch3: ', e);
})



// const p = new FePromise() // 'arguments is not a function'


// console.log(p, FePromise.prototype)

const pp = new Promise((resolve, reject) => {
    // console.log('Promise');
    setTimeout(() => {
        resolve(1234)
    }, 0)
    resolve(123)
    resolve(112233)
})
pp.then(e => {
    console.log('then: ', e);
}).then(e => {
    console.log('then2: ', e);
}).then(e => {
    console.log('then3: ', e);
}, (e) => {
    console.log('then3: reject', e);
})
pp.catch(e => {
    console.log('catch: ', e);
}).catch(e => {
    console.log('catch2: ', e);
}).catch(e => {
    console.log('catch3: ', e);
})