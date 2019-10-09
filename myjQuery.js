// 自调用函数作用：防止变量冲突，把所有 jQuery 封装时用到的变量都变成局部变量
(function () {
    // $ 其实就是一个函数
    var $ = function (selector) {
        // 调用 $() 的时候其实是返回一个新的 jQuery 对象
        return new Init(selector);
    }

    // ============= 模块1：选择器 =============
    // 实例 jQuery 对象需要用到的核心构造函数，接收 selector 选择器作为参数
    function Init(selector) {
        // 初始化一个数组，用于存放查找到的 DOM 节点
        var doms = [];
        // 功能1：如果传入的是<字符串>，就查找元素
        if (typeof selector === 'string') {
            // 先查找到 DOM 集合
            doms = document.querySelectorAll(selector);
        }
        // 功能2：如果传入的是一个<函数>，就实现入口函数功能
        else if (typeof selector === 'function') {
            // JQ 入口函数
            document.addEventListener('DOMContentLoaded', selector);
        }
        // 功能3：如果是<window>或<节点> ，把它包装变成 JQ 对象，就能调用 jQuery 方法，注：document 对象也是节点
        else if (selector === window || selector instanceof Node) {
            doms.push(selector);
        }
        // 功能4：如果是<DOM伪数组集合>，直接赋值到 doms 中
        else if (selector instanceof HTMLCollection || selector instanceof NodeList || selector instanceof Array) {
            doms = selector;
        }
        // 每次 new Init 创建 jQuery 对象，都把 doms 集合中的每个元素添加到新创建的 jQuery 对象中
        for (var i = 0; i < doms.length; i++) {
            // 遍历 DOM 对象添加到新对象中
            this[i] = doms[i];
        }
        // 给 jQuery 对象添加长度属性
        this.length = doms.length;
    }

    // ============= 模块2：类名操作 =============
    // Init 原型上添加方法，所以 jQuery 对象共享原型添加的方法
    Init.prototype.addClass = function (className) {
        // jQuery隐式迭代核心：遍历给集合中每个元素执行同样操作
        for (var i = 0; i < this.length; i++) {
            this[i].classList.add(className);
        }
        // jQuery链式编程核心：方法内部返回调用该方法的那个对象
        return this;
    }

    Init.prototype.removeClass = function (className) {
        // 利用 each 化简代码，高阶函数：把函数作为参数传递，函数在 each 内部执行
        return this.each(function (index, item) {
            item.classList.remove(className);
        });
    }

    Init.prototype.toggleClass = function (className) {
        // 利用 each 化简代码，高阶函数：把函数作为参数传递，函数在 each 内部执行
        return this.each(function (index, item) {
            item.classList.toggle(className);
        });
    }

    // ============= 模块3：each 遍历 =============
    // 隐式迭代核心： each 方法，用于遍历 jQuery 对象 !!!
    Init.prototype.each = function (fn) {
        // 遍历 jQuery 对象
        for (var i = 0; i < this.length; i++) {
            // 调用高阶回调函数，把实参 i 和 this[i] 传递过去
            // 通过 call 改变 调用 each 的时候 this 的指向为每个元素
            fn.call(this[i], i, this[i]);
        }
        // 链式编程：方法内部返回调用该方法的那个对象
        return this;
    }

    // ============= 模块4：显示隐藏切换 =============
    Init.prototype.show = function () {
        return this.each(function (index, item) {
            item.style.display = 'block';
        });
    }

    Init.prototype.hide = function () {
        return this.each(function (index, item) {
            item.style.display = 'none';
        });
    }

    Init.prototype.toggle = function () {
        return this.each(function (index, item) {
            if (getComputedStyle(item).display === 'none') {
                item.style.display = 'block'
            } else {
                item.style.display = 'none';
            }
        });
    }

    // ============= 模块5：获取和设置内容和表单值 =============
    Init.prototype.val = function (value) {
        // 1. 没传参获取的情况 - 不化简
        if (value === undefined) {
            var dom = this[0];
            return dom.value;
        }
        // 2. 传参数设置的情况 - 不化简
        return this.each(function (index, item) {
            item.value = value;
        });
    }

    Init.prototype.html = function (str) {
        // 1. 没传参获取的情况 - if 化简了成为一行代码
        if (str === undefined) return this[0].innerHTML;
        // 2. 传参数设置的情况
        return this.each(function (index, item) {
            item.innerHTML = str;
        });
    }

    Init.prototype.text = function (str) {
        // 1. 没传参获取的情况 - if 化简了成为一行代码
        if (str === undefined) return this[0].innerText;
        // 2. 传参数设置的情况 - ES6 箭头函数化简成了一行代码
        return this.each((index, item) => item.innerText = str);
    }


    // ============= 模块6：筛选查找方法 =============
    // eq 其实就是利用了传入一个 DOM 元素，把 DOM 元素变成 JQ 对象，内部返回包装后的 JQ 对象
    Init.prototype.eq = function (index) {
        // 考虑传入负数情况，倒序获取
        if (index < 0) index += this.length;
        // this[index]  是一个 DOM 元素，把 DOM 对象传递过去包装成 JQ 对象
        var dom = this[index];
        // 把 DOM 元素通过 new Init() 包装成一个 JQ 对象，内部返回包装后的 JQ 对象
        return new Init(dom);
    }

    // parent 功能其实就是把 DOM 父节点转成 JQ 对象，内部返回包装后的 JQ 对象
    Init.prototype.parent = function () {
        // 查找 DOM 元素
        var dom = this[0].parentNode;
        // 把 DOM 元素包装成新的 JQ 对象，内部返回包装后的 JQ 对象
        return new Init(dom);
    }

    // children 其实就是：当前元素的 所有孩子的集合
    Init.prototype.children = function () {
        // 查找 DOM 元素
        var doms = this[0].children;
        // 把 DOM 元素包装成新的 JQ 对象，内部返回包装后的 JQ 对象
        return new Init(doms);
    }

    // siblings 其实就是：当前元素的 父级的 所有孩子，但不包括当前元素的集合
    Init.prototype.siblings = function () {
        // 查找 DOM 元素
        var currentDom = this[0];
        // 根据当前元素的 父级的 所有孩子，并把伪数组转换成真数组
        var doms = Array.from(currentDom.parentNode.children);
        // indexOf 查找当前元素所在索引值，splice() 在集合中删除掉当前元素
        doms.splice(doms.indexOf(currentDom), 1);
        // 把 DOM 元素包装成新的 JQ 对象，内部返回包装后的 JQ 对象
        return new Init(doms);
    }

    // find 其实就是：当前元素的下的某个元素
    Init.prototype.find = function (selector) {
        // 查找 DOM 元素
        var doms = this[0].querySelectorAll(selector);
        // 把 DOM 元素包装成新的 JQ 对象，内部返回包装后的 JQ 对象
        return new Init(doms);
    }

    // ============= 模块7：筛选查找方法 =============
    // on 添加事件 - 隐式迭代 - 链式编程 - 事件委派
    Init.prototype.on = function (type, selector, fn) {
        // 功能1：先实现普通绑定  -   语法：$(选择器).on('click', function(){ })
        if (fn === undefined) {
            // 如果没有传入 fn，selector 就 位置就是事件处理函数
            fn = selector;
            // each 是实现隐式迭代
            // return 实现链式编程
            return this.each(function (index, item) {
                item.addEventListener(type, fn);
            });
        }
        // 功能2：实现普通绑定  -   语法：$(父选择器).on('click', '子元素', function(){ })
        return this.each(function (index, item) {
            // item 是事件源 - 委派的那个父元素
            item.addEventListener(type, function (event) {
                // 在父级下找所有的子元素
                var son = item.querySelectorAll(selector);
                // 检测一下当前点击的事件目标是否在选择器集合中，如果在就返回 true
                var isInclude = Array.from(son).includes(event.target);
                // 如果包含，触发事件处理函数，并通过 call 改变事件处理函数内部 this 的指向为事件目标，并传递 event 为事件对象参数
                if (isInclude) fn.call(event.target, event);
            });
        });
    }

    Init.prototype.off = function (type, selector, fn) {
        // 功能1：先实现普通绑定  -   语法：$(选择器).on('click', 函数名)
        if (fn === undefined) {
            // 如果没有传入 fn，selector 就 位置就是事件处理函数
            fn = selector;
            // return 实现链式编程   each 是实现隐式迭代
            return this.each(function (index, item) {
                item.removeEventListener(type, fn);
            });
        }
        // 功能2：实现解绑绑定  -   语法：$(父选择器).on('click', '子元素', 函数名)
        return this.each(function (index, item) {
            console.log('完善中');
        });
    }

    // ============= 模块8：属性操作 =============
    //  .removeProp() <移除>标准属性
    Init.prototype.removeProp = function (key) {
        return this.each(function () {
            // each 内部通过 call 改变了内部 this 指向为遍历的每个元素，所以可以不传形参，直接使用 this 代表之前的 item
            // 移除标准属性把值设置为 undefined 默认值即可
            this[key] = undefined;
        });
    }
    //  .prop()  <获取>和<设置>标准属性
    Init.prototype.prop = function (key, value) {
        // 功能1：如果参数2 是 字符串 或 数值型，普通属性设置
        if (typeof value === "string" || typeof value === "number") {
            return this.each(function () {
                this[key] = value;
            });
        }
        // 功能2：如果参数1 是 样式对象
        if (typeof key === "object") {
            // each 遍历样式对象
            return this.each(function () {
                // Object.keys(key) 返回值是数组，样式对象所有键名称
                // forEach 遍历样式对象的所有键名称
                Object.keys(key).forEach(item => {
                    // 把每个样式的值都设置到遍历的元素中
                    this[item] = key[item];
                });
            })
        }
        // 功能3：如果传入一个属性名，直接返回获取集合中第一个元素的属性值
        var dom = this[0];
        return dom[key];
    }

    //  .removeAttr() <移除>属性
    Init.prototype.removeAttr = function (key) {
        return this.each(function () {
            this.removeAttribute(key);
        });
    }
    //  .attr()  <获取>和<设置>属性
    Init.prototype.attr = function (key, value) {
        // 功能1：如果参数2 是 字符串 或 数值型，普通属性设置
        if (typeof value === "string" || typeof value === "number") {
            return this.each(function () {
                this.setAttribute(key, value);
            });
        }
        // 功能2：如果参数1 是 样式对象
        if (typeof key === "object") {
            // each 遍历样式对象
            return this.each(function () {
                // Object.keys(key) 返回值是数组，样式对象所有键名称
                // forEach 遍历样式对象的所有键名称
                Object.keys(key).forEach(item => {
                    // 把每个样式的值都设置到遍历的元素中
                    this.setAttribute(item, key[item]);
                });
            })
        }
        // 功能3：如果传入一个属性名，直接返回获取集合中第一个元素的属性值
        var dom = this[0];
        // 获取 DOM 元素的属性值
        var attrValue = dom.getAttribute(key);
        // 处理返回值 null 的情况，修改成 undefined，保持数据格式统一性
        return attrValue === null ? undefined : attrValue;
    }

    // ============= 模块9：行内样式操作 =============
    // 没有 px 单位的样式属性
    var addPx = function (key, value) {
        var noPx = [
            "animation-iteration-count",
            "column-count",
            "flex-grow",
            "flex-shrink",
            "font-weight",
            "line-height",
            "opacity",
            "order",
            "orphans",
            "widows",
            "z-index"
        ]
        // 如果设置的是不带 px 的属性，或者是字符串格式值，直接返回属性值
        if (noPx.includes(key) || typeof value === 'string') return value;
        // 如果 value 返回带 px 的单位
        // !/\D/.test('666')    true   是否纯数字
        // !/\D/.test('666px')  false  是否纯数字
        if (!/\D/.test(value)) return value + "px";
    }

    // css 方法，操作行内样式
    Init.prototype.css = function (key, value) {
        // 需要考虑是否为数值，数值是否需要带单位
        if (typeof value === "string") {
            return this.each(function () {
                // 把属性直接设置
                this.style[key] = value;
            });
        }
        // 如果是数值，考虑是否带 px
        if (typeof value === "number") {
            // 需要考虑是否带单位
            return this.each(function () {
                // 调用添加 px 方法，支持属性添加 px
                this.style[key] = addPx(key, value);
            });
        }
        // 如果是对象，多属性设置
        if (typeof key === "object") {
            // each 遍历，最后返回 this
            return this.each(function () {
                // Object.keys(key) 返回值是数组，样式对象所有键名称
                // forEach 遍历样式对象的所有键名称
                Object.keys(key).forEach(item => {
                    // 把每个样式的值都设置到遍历的元素中
                    this.style[item] = addPx(item, key[item]);
                });
            })
        }
        // 单属性获取
        var dom = this[0];
        return getComputedStyle(dom).getPropertyValue(key);
    }

    // 把局部的 jQuery 变量挂载到 window 全局对象中，占用 $ 和 jQuery 两个全局名称
    window.jQuery = window.$ = $;
})();
