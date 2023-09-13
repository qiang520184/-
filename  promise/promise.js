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
        try {  
            callback((resolve) => {
                if (this.PromiseState === STATUS[0]) {
                    this.PromiseState = STATUS[1]
                    this.PromiseResult = resolve
                    queueMicrotask(this.exec.bind(this))
                }

            }, (reject) => {
                if (this.PromiseState === STATUS[0]) {
                    this.PromiseState = STATUS[2]
                    this.PromiseResult = reject
                    queueMicrotask(this.exec.bind(this))
                }

            })
        } catch (error) {
            this.PromiseState = STATUS[2]
            this.PromiseResult = error
            queueMicrotask(this.exec.bind(this))

        }
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
        if (IsFunction(resolveCb) || IsFunction(rejectCb)) {
            this.index += 1;
        }
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
                let value = this.PromiseResult
                this.resolveCallbackList.forEach(({ cb }) => {
                    if(IsFunction(cb)) {
                        value = cb(value)
                        if (value instanceof FePromise) {
                            value = value.PromiseResult
                        }
                    }
                });
            } else {
                let [catchCb] = this.catchCallbackList
                IsFunction(catchCb) && catchCb(this.PromiseResult)

                if ( this.rejectCallbackList.length) {
                    let [{ index, cb: rejectCb }] = this.rejectCallbackList
                    IsFunction(rejectCb) && rejectCb(this.PromiseResult)
                
                    this.resolveCallbackList.slice(++index).forEach(({ cb: resolveCb }) => {
                        IsFunction(resolveCb) && resolveCb(undefined)
                    });
                }
            }
        }
    }
}


const p = new FePromise((resolve, reject) => {
    setTimeout(() => {
        resolve(4567)
    }, 0)
    resolve(456)
    // resolve(45678)

    // reject(445566)

    // setTimeout(() => {
    //     reject(4567)
    // }, 10)
    // reject(4567)
})
p.then(e => {
    console.log('then: ', e);
    return 'p .then - 1'
}).then(1).then(e => {
    console.log('then3: ', e);
    return new FePromise((resolve, reject) => {
        resolve(445566)
    })
},(e) => {
    console.log('p then3: reject', e);
}).then(e => {
    console.log('then: ', e);
    // return 'p .then - 2'
}).then(e => {
    console.log('then: ', e);
}).catch(e => {
    console.log('catch2: ', e);
}).catch(e => {
    console.log('catch3: ', e);
})
p.catch(e => {
    console.log('catch22: ', e);
}).catch(e => {
    console.log('catch33: ', e);
})

