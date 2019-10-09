// �Ե��ú������ã���ֹ������ͻ�������� jQuery ��װʱ�õ��ı�������ɾֲ�����
(function () {
    // $ ��ʵ����һ������
    var $ = function (selector) {
        // ���� $() ��ʱ����ʵ�Ƿ���һ���µ� jQuery ����
        return new Init(selector);
    }

    // ============= ģ��1��ѡ���� =============
    // ʵ�� jQuery ������Ҫ�õ��ĺ��Ĺ��캯�������� selector ѡ������Ϊ����
    function Init(selector) {
        // ��ʼ��һ�����飬���ڴ�Ų��ҵ��� DOM �ڵ�
        var doms = [];
        // ����1������������<�ַ���>���Ͳ���Ԫ��
        if (typeof selector === 'string') {
            // �Ȳ��ҵ� DOM ����
            doms = document.querySelectorAll(selector);
        }
        // ����2������������һ��<����>����ʵ����ں�������
        else if (typeof selector === 'function') {
            // JQ ��ں���
            document.addEventListener('DOMContentLoaded', selector);
        }
        // ����3�������<window>��<�ڵ�> ��������װ��� JQ ���󣬾��ܵ��� jQuery ������ע��document ����Ҳ�ǽڵ�
        else if (selector === window || selector instanceof Node) {
            doms.push(selector);
        }
        // ����4�������<DOMα���鼯��>��ֱ�Ӹ�ֵ�� doms ��
        else if (selector instanceof HTMLCollection || selector instanceof NodeList || selector instanceof Array) {
            doms = selector;
        }
        // ÿ�� new Init ���� jQuery ���󣬶��� doms �����е�ÿ��Ԫ����ӵ��´����� jQuery ������
        for (var i = 0; i < doms.length; i++) {
            // ���� DOM ������ӵ��¶�����
            this[i] = doms[i];
        }
        // �� jQuery ������ӳ�������
        this.length = doms.length;
    }

    // ============= ģ��2���������� =============
    // Init ԭ������ӷ��������� jQuery ������ԭ����ӵķ���
    Init.prototype.addClass = function (className) {
        // jQuery��ʽ�������ģ�������������ÿ��Ԫ��ִ��ͬ������
        for (var i = 0; i < this.length; i++) {
            this[i].classList.add(className);
        }
        // jQuery��ʽ��̺��ģ������ڲ����ص��ø÷������Ǹ�����
        return this;
    }

    Init.prototype.removeClass = function (className) {
        // ���� each ������룬�߽׺������Ѻ�����Ϊ�������ݣ������� each �ڲ�ִ��
        return this.each(function (index, item) {
            item.classList.remove(className);
        });
    }

    Init.prototype.toggleClass = function (className) {
        // ���� each ������룬�߽׺������Ѻ�����Ϊ�������ݣ������� each �ڲ�ִ��
        return this.each(function (index, item) {
            item.classList.toggle(className);
        });
    }

    // ============= ģ��3��each ���� =============
    // ��ʽ�������ģ� each ���������ڱ��� jQuery ���� !!!
    Init.prototype.each = function (fn) {
        // ���� jQuery ����
        for (var i = 0; i < this.length; i++) {
            // ���ø߽׻ص���������ʵ�� i �� this[i] ���ݹ�ȥ
            // ͨ�� call �ı� ���� each ��ʱ�� this ��ָ��Ϊÿ��Ԫ��
            fn.call(this[i], i, this[i]);
        }
        // ��ʽ��̣������ڲ����ص��ø÷������Ǹ�����
        return this;
    }

    // ============= ģ��4����ʾ�����л� =============
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

    // ============= ģ��5����ȡ���������ݺͱ�ֵ =============
    Init.prototype.val = function (value) {
        // 1. û���λ�ȡ����� - ������
        if (value === undefined) {
            var dom = this[0];
            return dom.value;
        }
        // 2. ���������õ���� - ������
        return this.each(function (index, item) {
            item.value = value;
        });
    }

    Init.prototype.html = function (str) {
        // 1. û���λ�ȡ����� - if �����˳�Ϊһ�д���
        if (str === undefined) return this[0].innerHTML;
        // 2. ���������õ����
        return this.each(function (index, item) {
            item.innerHTML = str;
        });
    }

    Init.prototype.text = function (str) {
        // 1. û���λ�ȡ����� - if �����˳�Ϊһ�д���
        if (str === undefined) return this[0].innerText;
        // 2. ���������õ���� - ES6 ��ͷ�����������һ�д���
        return this.each((index, item) => item.innerText = str);
    }


    // ============= ģ��6��ɸѡ���ҷ��� =============
    // eq ��ʵ���������˴���һ�� DOM Ԫ�أ��� DOM Ԫ�ر�� JQ �����ڲ����ذ�װ��� JQ ����
    Init.prototype.eq = function (index) {
        // ���Ǵ��븺������������ȡ
        if (index < 0) index += this.length;
        // this[index]  ��һ�� DOM Ԫ�أ��� DOM ���󴫵ݹ�ȥ��װ�� JQ ����
        var dom = this[index];
        // �� DOM Ԫ��ͨ�� new Init() ��װ��һ�� JQ �����ڲ����ذ�װ��� JQ ����
        return new Init(dom);
    }

    // parent ������ʵ���ǰ� DOM ���ڵ�ת�� JQ �����ڲ����ذ�װ��� JQ ����
    Init.prototype.parent = function () {
        // ���� DOM Ԫ��
        var dom = this[0].parentNode;
        // �� DOM Ԫ�ذ�װ���µ� JQ �����ڲ����ذ�װ��� JQ ����
        return new Init(dom);
    }

    // children ��ʵ���ǣ���ǰԪ�ص� ���к��ӵļ���
    Init.prototype.children = function () {
        // ���� DOM Ԫ��
        var doms = this[0].children;
        // �� DOM Ԫ�ذ�װ���µ� JQ �����ڲ����ذ�װ��� JQ ����
        return new Init(doms);
    }

    // siblings ��ʵ���ǣ���ǰԪ�ص� ������ ���к��ӣ�����������ǰԪ�صļ���
    Init.prototype.siblings = function () {
        // ���� DOM Ԫ��
        var currentDom = this[0];
        // ���ݵ�ǰԪ�ص� ������ ���к��ӣ�����α����ת����������
        var doms = Array.from(currentDom.parentNode.children);
        // indexOf ���ҵ�ǰԪ����������ֵ��splice() �ڼ�����ɾ������ǰԪ��
        doms.splice(doms.indexOf(currentDom), 1);
        // �� DOM Ԫ�ذ�װ���µ� JQ �����ڲ����ذ�װ��� JQ ����
        return new Init(doms);
    }

    // find ��ʵ���ǣ���ǰԪ�ص��µ�ĳ��Ԫ��
    Init.prototype.find = function (selector) {
        // ���� DOM Ԫ��
        var doms = this[0].querySelectorAll(selector);
        // �� DOM Ԫ�ذ�װ���µ� JQ �����ڲ����ذ�װ��� JQ ����
        return new Init(doms);
    }

    // ============= ģ��7��ɸѡ���ҷ��� =============
    // on ����¼� - ��ʽ���� - ��ʽ��� - �¼�ί��
    Init.prototype.on = function (type, selector, fn) {
        // ����1����ʵ����ͨ��  -   �﷨��$(ѡ����).on('click', function(){ })
        if (fn === undefined) {
            // ���û�д��� fn��selector �� λ�þ����¼�������
            fn = selector;
            // each ��ʵ����ʽ����
            // return ʵ����ʽ���
            return this.each(function (index, item) {
                item.addEventListener(type, fn);
            });
        }
        // ����2��ʵ����ͨ��  -   �﷨��$(��ѡ����).on('click', '��Ԫ��', function(){ })
        return this.each(function (index, item) {
            // item ���¼�Դ - ί�ɵ��Ǹ���Ԫ��
            item.addEventListener(type, function (event) {
                // �ڸ����������е���Ԫ��
                var son = item.querySelectorAll(selector);
                // ���һ�µ�ǰ������¼�Ŀ���Ƿ���ѡ���������У�����ھͷ��� true
                var isInclude = Array.from(son).includes(event.target);
                // ��������������¼�����������ͨ�� call �ı��¼��������ڲ� this ��ָ��Ϊ�¼�Ŀ�꣬������ event Ϊ�¼��������
                if (isInclude) fn.call(event.target, event);
            });
        });
    }

    Init.prototype.off = function (type, selector, fn) {
        // ����1����ʵ����ͨ��  -   �﷨��$(ѡ����).on('click', ������)
        if (fn === undefined) {
            // ���û�д��� fn��selector �� λ�þ����¼�������
            fn = selector;
            // return ʵ����ʽ���   each ��ʵ����ʽ����
            return this.each(function (index, item) {
                item.removeEventListener(type, fn);
            });
        }
        // ����2��ʵ�ֽ���  -   �﷨��$(��ѡ����).on('click', '��Ԫ��', ������)
        return this.each(function (index, item) {
            console.log('������');
        });
    }

    // ============= ģ��8�����Բ��� =============
    //  .removeProp() <�Ƴ�>��׼����
    Init.prototype.removeProp = function (key) {
        return this.each(function () {
            // each �ڲ�ͨ�� call �ı����ڲ� this ָ��Ϊ������ÿ��Ԫ�أ����Կ��Բ����βΣ�ֱ��ʹ�� this ����֮ǰ�� item
            // �Ƴ���׼���԰�ֵ����Ϊ undefined Ĭ��ֵ����
            this[key] = undefined;
        });
    }
    //  .prop()  <��ȡ>��<����>��׼����
    Init.prototype.prop = function (key, value) {
        // ����1���������2 �� �ַ��� �� ��ֵ�ͣ���ͨ��������
        if (typeof value === "string" || typeof value === "number") {
            return this.each(function () {
                this[key] = value;
            });
        }
        // ����2���������1 �� ��ʽ����
        if (typeof key === "object") {
            // each ������ʽ����
            return this.each(function () {
                // Object.keys(key) ����ֵ�����飬��ʽ�������м�����
                // forEach ������ʽ��������м�����
                Object.keys(key).forEach(item => {
                    // ��ÿ����ʽ��ֵ�����õ�������Ԫ����
                    this[item] = key[item];
                });
            })
        }
        // ����3���������һ����������ֱ�ӷ��ػ�ȡ�����е�һ��Ԫ�ص�����ֵ
        var dom = this[0];
        return dom[key];
    }

    //  .removeAttr() <�Ƴ�>����
    Init.prototype.removeAttr = function (key) {
        return this.each(function () {
            this.removeAttribute(key);
        });
    }
    //  .attr()  <��ȡ>��<����>����
    Init.prototype.attr = function (key, value) {
        // ����1���������2 �� �ַ��� �� ��ֵ�ͣ���ͨ��������
        if (typeof value === "string" || typeof value === "number") {
            return this.each(function () {
                this.setAttribute(key, value);
            });
        }
        // ����2���������1 �� ��ʽ����
        if (typeof key === "object") {
            // each ������ʽ����
            return this.each(function () {
                // Object.keys(key) ����ֵ�����飬��ʽ�������м�����
                // forEach ������ʽ��������м�����
                Object.keys(key).forEach(item => {
                    // ��ÿ����ʽ��ֵ�����õ�������Ԫ����
                    this.setAttribute(item, key[item]);
                });
            })
        }
        // ����3���������һ����������ֱ�ӷ��ػ�ȡ�����е�һ��Ԫ�ص�����ֵ
        var dom = this[0];
        // ��ȡ DOM Ԫ�ص�����ֵ
        var attrValue = dom.getAttribute(key);
        // ������ֵ null ��������޸ĳ� undefined���������ݸ�ʽͳһ��
        return attrValue === null ? undefined : attrValue;
    }

    // ============= ģ��9��������ʽ���� =============
    // û�� px ��λ����ʽ����
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
        // ������õ��ǲ��� px �����ԣ��������ַ�����ʽֵ��ֱ�ӷ�������ֵ
        if (noPx.includes(key) || typeof value === 'string') return value;
        // ��� value ���ش� px �ĵ�λ
        // !/\D/.test('666')    true   �Ƿ�����
        // !/\D/.test('666px')  false  �Ƿ�����
        if (!/\D/.test(value)) return value + "px";
    }

    // css ����������������ʽ
    Init.prototype.css = function (key, value) {
        // ��Ҫ�����Ƿ�Ϊ��ֵ����ֵ�Ƿ���Ҫ����λ
        if (typeof value === "string") {
            return this.each(function () {
                // ������ֱ������
                this.style[key] = value;
            });
        }
        // �������ֵ�������Ƿ�� px
        if (typeof value === "number") {
            // ��Ҫ�����Ƿ����λ
            return this.each(function () {
                // ������� px ������֧��������� px
                this.style[key] = addPx(key, value);
            });
        }
        // ����Ƕ��󣬶���������
        if (typeof key === "object") {
            // each ��������󷵻� this
            return this.each(function () {
                // Object.keys(key) ����ֵ�����飬��ʽ�������м�����
                // forEach ������ʽ��������м�����
                Object.keys(key).forEach(item => {
                    // ��ÿ����ʽ��ֵ�����õ�������Ԫ����
                    this.style[item] = addPx(item, key[item]);
                });
            })
        }
        // �����Ի�ȡ
        var dom = this[0];
        return getComputedStyle(dom).getPropertyValue(key);
    }

    // �Ѿֲ��� jQuery �������ص� window ȫ�ֶ����У�ռ�� $ �� jQuery ����ȫ������
    window.jQuery = window.$ = $;
})();
