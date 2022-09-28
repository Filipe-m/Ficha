
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    const identity = x => x;
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    let src_url_equal_anchor;
    function src_url_equal(element_src, url) {
        if (!src_url_equal_anchor) {
            src_url_equal_anchor = document.createElement('a');
        }
        src_url_equal_anchor.href = url;
        return element_src === src_url_equal_anchor.href;
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function get_root_for_style(node) {
        if (!node)
            return document;
        const root = node.getRootNode ? node.getRootNode() : node.ownerDocument;
        if (root && root.host) {
            return root;
        }
        return node.ownerDocument;
    }
    function append_empty_stylesheet(node) {
        const style_element = element('style');
        append_stylesheet(get_root_for_style(node), style_element);
        return style_element.sheet;
    }
    function append_stylesheet(node, style) {
        append(node.head || node, style);
        return style.sheet;
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function to_number(value) {
        return value === '' ? null : +value;
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        if (value === null) {
            node.style.removeProperty(key);
        }
        else {
            node.style.setProperty(key, value, important ? 'important' : '');
        }
    }
    function custom_event(type, detail, { bubbles = false, cancelable = false } = {}) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, cancelable, detail);
        return e;
    }

    // we need to store the information for multiple documents because a Svelte application could also contain iframes
    // https://github.com/sveltejs/svelte/issues/3624
    const managed_styles = new Map();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_style_information(doc, node) {
        const info = { stylesheet: append_empty_stylesheet(node), rules: {} };
        managed_styles.set(doc, info);
        return info;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = get_root_for_style(node);
        const { stylesheet, rules } = managed_styles.get(doc) || create_style_information(doc, node);
        if (!rules[name]) {
            rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            managed_styles.forEach(info => {
                const { ownerNode } = info.stylesheet;
                // there is no ownerNode if it runs on jsdom.
                if (ownerNode)
                    detach(ownerNode);
            });
            managed_styles.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
        else if (callback) {
            callback();
        }
    }
    const null_transition = { duration: 0 };
    function create_bidirectional_transition(node, fn, params, intro) {
        let config = fn(node, params);
        let t = intro ? 0 : 1;
        let running_program = null;
        let pending_program = null;
        let animation_name = null;
        function clear_animation() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function init(program, duration) {
            const d = (program.b - t);
            duration *= Math.abs(d);
            return {
                a: t,
                b: program.b,
                d,
                duration,
                start: program.start,
                end: program.start + duration,
                group: program.group
            };
        }
        function go(b) {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            const program = {
                start: now() + delay,
                b
            };
            if (!b) {
                // @ts-ignore todo: improve typings
                program.group = outros;
                outros.r += 1;
            }
            if (running_program || pending_program) {
                pending_program = program;
            }
            else {
                // if this is an intro, and there's a delay, we need to do
                // an initial tick and/or apply CSS animation immediately
                if (css) {
                    clear_animation();
                    animation_name = create_rule(node, t, b, duration, delay, easing, css);
                }
                if (b)
                    tick(0, 1);
                running_program = init(program, duration);
                add_render_callback(() => dispatch(node, b, 'start'));
                loop(now => {
                    if (pending_program && now > pending_program.start) {
                        running_program = init(pending_program, duration);
                        pending_program = null;
                        dispatch(node, running_program.b, 'start');
                        if (css) {
                            clear_animation();
                            animation_name = create_rule(node, t, running_program.b, running_program.duration, 0, easing, config.css);
                        }
                    }
                    if (running_program) {
                        if (now >= running_program.end) {
                            tick(t = running_program.b, 1 - t);
                            dispatch(node, running_program.b, 'end');
                            if (!pending_program) {
                                // we're done
                                if (running_program.b) {
                                    // intro — we can tidy up immediately
                                    clear_animation();
                                }
                                else {
                                    // outro — needs to be coordinated
                                    if (!--running_program.group.r)
                                        run_all(running_program.group.c);
                                }
                            }
                            running_program = null;
                        }
                        else if (now >= running_program.start) {
                            const p = now - running_program.start;
                            t = running_program.a + running_program.d * easing(p / running_program.duration);
                            tick(t, 1 - t);
                        }
                    }
                    return !!(running_program || pending_program);
                });
            }
        }
        return {
            run(b) {
                if (is_function(config)) {
                    wait().then(() => {
                        // @ts-ignore
                        config = config();
                        go(b);
                    });
                }
                else {
                    go(b);
                }
            },
            end() {
                clear_animation();
                running_program = pending_program = null;
            }
        };
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.50.1' }, detail), { bubbles: true }));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }
    function sineInOut(t) {
        return -0.5 * (Math.cos(Math.PI * t) - 1);
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function slide(node, { delay = 0, duration = 400, easing = cubicOut } = {}) {
        const style = getComputedStyle(node);
        const opacity = +style.opacity;
        const height = parseFloat(style.height);
        const padding_top = parseFloat(style.paddingTop);
        const padding_bottom = parseFloat(style.paddingBottom);
        const margin_top = parseFloat(style.marginTop);
        const margin_bottom = parseFloat(style.marginBottom);
        const border_top_width = parseFloat(style.borderTopWidth);
        const border_bottom_width = parseFloat(style.borderBottomWidth);
        return {
            delay,
            duration,
            easing,
            css: t => 'overflow: hidden;' +
                `opacity: ${Math.min(t * 20, 1) * opacity};` +
                `height: ${t * height}px;` +
                `padding-top: ${t * padding_top}px;` +
                `padding-bottom: ${t * padding_bottom}px;` +
                `margin-top: ${t * margin_top}px;` +
                `margin-bottom: ${t * margin_bottom}px;` +
                `border-top-width: ${t * border_top_width}px;` +
                `border-bottom-width: ${t * border_bottom_width}px;`
        };
    }

    /* src\App.svelte generated by Svelte v3.50.1 */
    const file = "src\\App.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[41] = list[i];
    	return child_ctx;
    }

    // (334:2) {#if roll}
    function create_if_block_1(ctx) {
    	let div3;
    	let div2;
    	let div0;
    	let h1;
    	let t0;
    	let t1;
    	let div1;
    	let h2;
    	let t2;
    	let t3;
    	let sup;
    	let t4;
    	let t5;
    	let div3_transition;
    	let current;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div0 = element("div");
    			h1 = element("h1");
    			t0 = text(/*dadoCerto*/ ctx[0]);
    			t1 = space();
    			div1 = element("div");
    			h2 = element("h2");
    			t2 = text(/*sequencia*/ ctx[1]);
    			t3 = space();
    			sup = element("sup");
    			t4 = text("+");
    			t5 = text(/*modificador*/ ctx[2]);
    			add_location(h1, file, 342, 10, 9147);
    			attr_dev(div0, "class", "big");
    			add_location(div0, file, 341, 8, 9119);
    			add_location(sup, file, 345, 40, 9253);
    			attr_dev(h2, "class", "lista");
    			add_location(h2, file, 345, 10, 9223);
    			attr_dev(div1, "class", "smaller");
    			add_location(div1, file, 344, 8, 9191);
    			attr_dev(div2, "class", "whiteBox");
    			add_location(div2, file, 340, 6, 9088);
    			attr_dev(div3, "class", "screen");
    			attr_dev(div3, "id", "screen");
    			add_location(div3, file, 334, 4, 8955);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h1);
    			append_dev(h1, t0);
    			append_dev(div2, t1);
    			append_dev(div2, div1);
    			append_dev(div1, h2);
    			append_dev(h2, t2);
    			append_dev(h2, t3);
    			append_dev(h2, sup);
    			append_dev(sup, t4);
    			append_dev(sup, t5);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div3, "click", /*turnOff*/ ctx[9], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (!current || dirty[0] & /*dadoCerto*/ 1) set_data_dev(t0, /*dadoCerto*/ ctx[0]);
    			if (!current || dirty[0] & /*sequencia*/ 2) set_data_dev(t2, /*sequencia*/ ctx[1]);
    			if (!current || dirty[0] & /*modificador*/ 4) set_data_dev(t5, /*modificador*/ ctx[2]);
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { delay: 0, duration: 200 }, true);
    				div3_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div3_transition) div3_transition = create_bidirectional_transition(div3, fade, { delay: 0, duration: 200 }, false);
    			div3_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			if (detaching && div3_transition) div3_transition.end();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(334:2) {#if roll}",
    		ctx
    	});

    	return block;
    }

    // (360:8) {#if char.open}
    function create_if_block(ctx) {
    	let div5;
    	let div0;
    	let h10;
    	let t0;
    	let span0;
    	let t1_value = /*char*/ ctx[41].força + "";
    	let t1;
    	let t2;
    	let h11;
    	let t3;
    	let span1;
    	let t4_value = /*char*/ ctx[41].destreza + "";
    	let t4;
    	let t5;
    	let h12;
    	let t6;
    	let span2;
    	let t7_value = /*char*/ ctx[41].constituição + "";
    	let t7;
    	let t8;
    	let h13;
    	let t9;
    	let span3;
    	let t10_value = /*char*/ ctx[41].carisma + "";
    	let t10;
    	let t11;
    	let h14;
    	let t12;
    	let span4;
    	let t13_value = /*char*/ ctx[41].inteligencia + "";
    	let t13;
    	let t14;
    	let h15;
    	let t15;
    	let span5;
    	let t16_value = /*char*/ ctx[41].percepção + "";
    	let t16;
    	let t17;
    	let div4;
    	let div1;
    	let label0;
    	let t19;
    	let progress0;
    	let progress0_value_value;
    	let progress0_max_value;
    	let t20;
    	let label1;
    	let t21_value = /*char*/ ctx[41].life + "";
    	let t21;
    	let t22;
    	let t23_value = /*char*/ ctx[41].totalLife + "";
    	let t23;
    	let t24;
    	let div2;
    	let label2;
    	let t26;
    	let progress1;
    	let t27;
    	let progress1_value_value;
    	let progress1_max_value;
    	let t28;
    	let label3;
    	let t29_value = /*char*/ ctx[41].sanidade + "";
    	let t29;
    	let t30;
    	let t31_value = /*char*/ ctx[41].sanidadeTotal + "";
    	let t31;
    	let t32;
    	let div3;
    	let input;
    	let t33;
    	let button0;
    	let img0;
    	let img0_src_value;
    	let t34;
    	let button1;
    	let img1;
    	let img1_src_value;
    	let t35;
    	let button2;
    	let img2;
    	let img2_src_value;
    	let t36;
    	let button3;
    	let img3;
    	let img3_src_value;
    	let div5_transition;
    	let current;
    	let mounted;
    	let dispose;

    	function click_handler_7() {
    		return /*click_handler_7*/ ctx[22](/*char*/ ctx[41]);
    	}

    	function click_handler_8() {
    		return /*click_handler_8*/ ctx[23](/*char*/ ctx[41]);
    	}

    	function click_handler_9() {
    		return /*click_handler_9*/ ctx[24](/*char*/ ctx[41]);
    	}

    	function click_handler_10() {
    		return /*click_handler_10*/ ctx[25](/*char*/ ctx[41]);
    	}

    	function click_handler_11() {
    		return /*click_handler_11*/ ctx[26](/*char*/ ctx[41]);
    	}

    	function click_handler_12() {
    		return /*click_handler_12*/ ctx[27](/*char*/ ctx[41]);
    	}

    	function click_handler_13() {
    		return /*click_handler_13*/ ctx[29](/*char*/ ctx[41]);
    	}

    	function click_handler_14() {
    		return /*click_handler_14*/ ctx[30](/*char*/ ctx[41]);
    	}

    	function click_handler_15() {
    		return /*click_handler_15*/ ctx[31](/*char*/ ctx[41]);
    	}

    	function click_handler_16() {
    		return /*click_handler_16*/ ctx[32](/*char*/ ctx[41]);
    	}

    	const block = {
    		c: function create() {
    			div5 = element("div");
    			div0 = element("div");
    			h10 = element("h1");
    			t0 = text("Força: ");
    			span0 = element("span");
    			t1 = text(t1_value);
    			t2 = space();
    			h11 = element("h1");
    			t3 = text("Destreza: ");
    			span1 = element("span");
    			t4 = text(t4_value);
    			t5 = space();
    			h12 = element("h1");
    			t6 = text("Constituição: ");
    			span2 = element("span");
    			t7 = text(t7_value);
    			t8 = space();
    			h13 = element("h1");
    			t9 = text("Carisma: ");
    			span3 = element("span");
    			t10 = text(t10_value);
    			t11 = space();
    			h14 = element("h1");
    			t12 = text("Inteligência: ");
    			span4 = element("span");
    			t13 = text(t13_value);
    			t14 = space();
    			h15 = element("h1");
    			t15 = text("Percepção: ");
    			span5 = element("span");
    			t16 = text(t16_value);
    			t17 = space();
    			div4 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			label0.textContent = "Vida:";
    			t19 = space();
    			progress0 = element("progress");
    			t20 = space();
    			label1 = element("label");
    			t21 = text(t21_value);
    			t22 = text("/");
    			t23 = text(t23_value);
    			t24 = space();
    			div2 = element("div");
    			label2 = element("label");
    			label2.textContent = "Sanidade:";
    			t26 = space();
    			progress1 = element("progress");
    			t27 = text("20");
    			t28 = space();
    			label3 = element("label");
    			t29 = text(t29_value);
    			t30 = text("/");
    			t31 = text(t31_value);
    			t32 = space();
    			div3 = element("div");
    			input = element("input");
    			t33 = space();
    			button0 = element("button");
    			img0 = element("img");
    			t34 = space();
    			button1 = element("button");
    			img1 = element("img");
    			t35 = space();
    			button2 = element("button");
    			img2 = element("img");
    			t36 = space();
    			button3 = element("button");
    			img3 = element("img");
    			attr_dev(span0, "class", "number");
    			add_location(span0, file, 369, 23, 10005);
    			attr_dev(h10, "class", "stat");
    			add_location(h10, file, 365, 14, 9852);
    			attr_dev(span1, "class", "number");
    			add_location(span1, file, 376, 26, 10260);
    			attr_dev(h11, "class", "stat");
    			add_location(h11, file, 371, 14, 10080);
    			attr_dev(span2, "class", "number");
    			add_location(span2, file, 383, 30, 10530);
    			attr_dev(h12, "class", "stat");
    			add_location(h12, file, 378, 14, 10338);
    			attr_dev(span3, "class", "number");
    			add_location(span3, file, 390, 25, 10789);
    			attr_dev(h13, "class", "stat");
    			add_location(h13, file, 385, 14, 10612);
    			attr_dev(span4, "class", "number");
    			add_location(span4, file, 397, 30, 11058);
    			attr_dev(h14, "class", "stat");
    			add_location(h14, file, 392, 14, 10866);
    			attr_dev(span5, "class", "number");
    			add_location(span5, file, 404, 27, 11323);
    			attr_dev(h15, "class", "stat");
    			add_location(h15, file, 399, 14, 11140);
    			attr_dev(div0, "class", "stats");
    			add_location(div0, file, 364, 12, 9818);
    			attr_dev(label0, "for", "vida");
    			add_location(label0, file, 409, 16, 11489);
    			attr_dev(progress0, "class", "vida");
    			progress0.value = progress0_value_value = /*char*/ ctx[41].life;
    			attr_dev(progress0, "max", progress0_max_value = /*char*/ ctx[41].totalLife);
    			add_location(progress0, file, 410, 16, 11537);
    			attr_dev(label1, "for", "vida");
    			add_location(label1, file, 411, 16, 11618);
    			attr_dev(div1, "class", "life");
    			add_location(div1, file, 408, 14, 11454);
    			attr_dev(label2, "for", "sanidade");
    			add_location(label2, file, 414, 16, 11745);
    			attr_dev(progress1, "class", "sanidade");
    			progress1.value = progress1_value_value = /*char*/ ctx[41].sanidade;
    			attr_dev(progress1, "max", progress1_max_value = /*char*/ ctx[41].sanidadeTotal);
    			add_location(progress1, file, 415, 16, 11801);
    			attr_dev(label3, "for", "sanidade");
    			add_location(label3, file, 420, 16, 11976);
    			attr_dev(div2, "class", "sanity");
    			add_location(div2, file, 413, 14, 11708);
    			attr_dev(input, "type", "number");
    			attr_dev(input, "class", "text");
    			add_location(input, file, 425, 16, 12152);
    			attr_dev(img0, "class", "image");
    			attr_dev(img0, "alt", "Dano");
    			if (!src_url_equal(img0.src, img0_src_value = "https://img.icons8.com/color/344/drop-of-blood.png")) attr_dev(img0, "src", img0_src_value);
    			add_location(img0, file, 427, 19, 12314);
    			attr_dev(button0, "class", "button");
    			add_location(button0, file, 426, 16, 12230);
    			attr_dev(img1, "class", "image");
    			attr_dev(img1, "alt", "Cura");
    			if (!src_url_equal(img1.src, img1_src_value = "https://img.icons8.com/fluency/344/pill.png")) attr_dev(img1, "src", img1_src_value);
    			add_location(img1, file, 434, 19, 12608);
    			attr_dev(button1, "class", "button");
    			add_location(button1, file, 433, 16, 12524);
    			attr_dev(img2, "class", "image");
    			attr_dev(img2, "alt", "-Sanidade");
    			if (!src_url_equal(img2.src, img2_src_value = "https://img.icons8.com/ios/344/poison.png")) attr_dev(img2, "src", img2_src_value);
    			add_location(img2, file, 443, 19, 12940);
    			attr_dev(button2, "class", "button");
    			add_location(button2, file, 440, 16, 12811);
    			attr_dev(img3, "class", "image");
    			attr_dev(img3, "alt", "+Sanidade");
    			if (!src_url_equal(img3.src, img3_src_value = "https://img.icons8.com/external-dreamstale-lineal-dreamstale/344/external-happy-emoji-dreamstale-lineal-dreamstale-2.png")) attr_dev(img3, "src", img3_src_value);
    			add_location(img3, file, 452, 19, 13274);
    			attr_dev(button3, "class", "button");
    			add_location(button3, file, 449, 16, 13146);
    			attr_dev(div3, "class", "buttons");
    			add_location(div3, file, 424, 14, 12114);
    			attr_dev(div4, "class", "health");
    			add_location(div4, file, 407, 12, 11419);
    			attr_dev(div5, "class", "colapsible");
    			add_location(div5, file, 360, 10, 9680);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div5, anchor);
    			append_dev(div5, div0);
    			append_dev(div0, h10);
    			append_dev(h10, t0);
    			append_dev(h10, span0);
    			append_dev(span0, t1);
    			append_dev(div0, t2);
    			append_dev(div0, h11);
    			append_dev(h11, t3);
    			append_dev(h11, span1);
    			append_dev(span1, t4);
    			append_dev(div0, t5);
    			append_dev(div0, h12);
    			append_dev(h12, t6);
    			append_dev(h12, span2);
    			append_dev(span2, t7);
    			append_dev(div0, t8);
    			append_dev(div0, h13);
    			append_dev(h13, t9);
    			append_dev(h13, span3);
    			append_dev(span3, t10);
    			append_dev(div0, t11);
    			append_dev(div0, h14);
    			append_dev(h14, t12);
    			append_dev(h14, span4);
    			append_dev(span4, t13);
    			append_dev(div0, t14);
    			append_dev(div0, h15);
    			append_dev(h15, t15);
    			append_dev(h15, span5);
    			append_dev(span5, t16);
    			append_dev(div5, t17);
    			append_dev(div5, div4);
    			append_dev(div4, div1);
    			append_dev(div1, label0);
    			append_dev(div1, t19);
    			append_dev(div1, progress0);
    			append_dev(div1, t20);
    			append_dev(div1, label1);
    			append_dev(label1, t21);
    			append_dev(label1, t22);
    			append_dev(label1, t23);
    			append_dev(div4, t24);
    			append_dev(div4, div2);
    			append_dev(div2, label2);
    			append_dev(div2, t26);
    			append_dev(div2, progress1);
    			append_dev(progress1, t27);
    			append_dev(div2, t28);
    			append_dev(div2, label3);
    			append_dev(label3, t29);
    			append_dev(label3, t30);
    			append_dev(label3, t31);
    			append_dev(div4, t32);
    			append_dev(div4, div3);
    			append_dev(div3, input);
    			set_input_value(input, /*statusvalue*/ ctx[4]);
    			append_dev(div3, t33);
    			append_dev(div3, button0);
    			append_dev(button0, img0);
    			append_dev(div3, t34);
    			append_dev(div3, button1);
    			append_dev(button1, img1);
    			append_dev(div3, t35);
    			append_dev(div3, button2);
    			append_dev(button2, img2);
    			append_dev(div3, t36);
    			append_dev(div3, button3);
    			append_dev(button3, img3);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(h10, "click", click_handler_7, false, false, false),
    					listen_dev(h11, "click", click_handler_8, false, false, false),
    					listen_dev(h12, "click", click_handler_9, false, false, false),
    					listen_dev(h13, "click", click_handler_10, false, false, false),
    					listen_dev(h14, "click", click_handler_11, false, false, false),
    					listen_dev(h15, "click", click_handler_12, false, false, false),
    					listen_dev(input, "input", /*input_input_handler*/ ctx[28]),
    					listen_dev(button0, "click", click_handler_13, false, false, false),
    					listen_dev(button1, "click", click_handler_14, false, false, false),
    					listen_dev(button2, "click", click_handler_15, false, false, false),
    					listen_dev(button3, "click", click_handler_16, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*characters*/ 32) && t1_value !== (t1_value = /*char*/ ctx[41].força + "")) set_data_dev(t1, t1_value);
    			if ((!current || dirty[0] & /*characters*/ 32) && t4_value !== (t4_value = /*char*/ ctx[41].destreza + "")) set_data_dev(t4, t4_value);
    			if ((!current || dirty[0] & /*characters*/ 32) && t7_value !== (t7_value = /*char*/ ctx[41].constituição + "")) set_data_dev(t7, t7_value);
    			if ((!current || dirty[0] & /*characters*/ 32) && t10_value !== (t10_value = /*char*/ ctx[41].carisma + "")) set_data_dev(t10, t10_value);
    			if ((!current || dirty[0] & /*characters*/ 32) && t13_value !== (t13_value = /*char*/ ctx[41].inteligencia + "")) set_data_dev(t13, t13_value);
    			if ((!current || dirty[0] & /*characters*/ 32) && t16_value !== (t16_value = /*char*/ ctx[41].percepção + "")) set_data_dev(t16, t16_value);

    			if (!current || dirty[0] & /*characters*/ 32 && progress0_value_value !== (progress0_value_value = /*char*/ ctx[41].life)) {
    				prop_dev(progress0, "value", progress0_value_value);
    			}

    			if (!current || dirty[0] & /*characters*/ 32 && progress0_max_value !== (progress0_max_value = /*char*/ ctx[41].totalLife)) {
    				attr_dev(progress0, "max", progress0_max_value);
    			}

    			if ((!current || dirty[0] & /*characters*/ 32) && t21_value !== (t21_value = /*char*/ ctx[41].life + "")) set_data_dev(t21, t21_value);
    			if ((!current || dirty[0] & /*characters*/ 32) && t23_value !== (t23_value = /*char*/ ctx[41].totalLife + "")) set_data_dev(t23, t23_value);

    			if (!current || dirty[0] & /*characters*/ 32 && progress1_value_value !== (progress1_value_value = /*char*/ ctx[41].sanidade)) {
    				prop_dev(progress1, "value", progress1_value_value);
    			}

    			if (!current || dirty[0] & /*characters*/ 32 && progress1_max_value !== (progress1_max_value = /*char*/ ctx[41].sanidadeTotal)) {
    				attr_dev(progress1, "max", progress1_max_value);
    			}

    			if ((!current || dirty[0] & /*characters*/ 32) && t29_value !== (t29_value = /*char*/ ctx[41].sanidade + "")) set_data_dev(t29, t29_value);
    			if ((!current || dirty[0] & /*characters*/ 32) && t31_value !== (t31_value = /*char*/ ctx[41].sanidadeTotal + "")) set_data_dev(t31, t31_value);

    			if (dirty[0] & /*statusvalue*/ 16 && to_number(input.value) !== /*statusvalue*/ ctx[4]) {
    				set_input_value(input, /*statusvalue*/ ctx[4]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (!div5_transition) div5_transition = create_bidirectional_transition(
    					div5,
    					slide,
    					{
    						delay: 0,
    						duration: 400,
    						easing: sineInOut
    					},
    					true
    				);

    				div5_transition.run(1);
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (!div5_transition) div5_transition = create_bidirectional_transition(
    				div5,
    				slide,
    				{
    					delay: 0,
    					duration: 400,
    					easing: sineInOut
    				},
    				false
    			);

    			div5_transition.run(0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div5);
    			if (detaching && div5_transition) div5_transition.end();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(360:8) {#if char.open}",
    		ctx
    	});

    	return block;
    }

    // (352:4) {#each characters as char (char.id)}
    function create_each_block(key_1, ctx) {
    	let div;
    	let header;
    	let h3;
    	let t0_value = /*char*/ ctx[41].name + "";
    	let t0;
    	let t1;
    	let span;
    	let t3;
    	let t4;
    	let current;
    	let mounted;
    	let dispose;

    	function click_handler_6() {
    		return /*click_handler_6*/ ctx[21](/*char*/ ctx[41]);
    	}

    	let if_block = /*char*/ ctx[41].open && create_if_block(ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			div = element("div");
    			header = element("header");
    			h3 = element("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			span = element("span");
    			span.textContent = "+";
    			t3 = space();
    			if (if_block) if_block.c();
    			t4 = space();
    			add_location(h3, file, 354, 10, 9497);
    			set_style(span, "color", "#26092e");
    			set_style(span, "font-family", "sans");
    			set_style(span, "font-size", "2.5rem");
    			add_location(span, file, 355, 10, 9528);
    			attr_dev(header, "class", "summary");
    			add_location(header, file, 353, 8, 9429);
    			attr_dev(div, "class", "details");
    			add_location(div, file, 352, 6, 9399);
    			this.first = div;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, header);
    			append_dev(header, h3);
    			append_dev(h3, t0);
    			append_dev(header, t1);
    			append_dev(header, span);
    			append_dev(div, t3);
    			if (if_block) if_block.m(div, null);
    			append_dev(div, t4);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(header, "click", click_handler_6, false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if ((!current || dirty[0] & /*characters*/ 32) && t0_value !== (t0_value = /*char*/ ctx[41].name + "")) set_data_dev(t0, t0_value);

    			if (/*char*/ ctx[41].open) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*characters*/ 32) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(div, t4);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(352:4) {#each characters as char (char.id)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let img;
    	let img_src_value;
    	let t0;
    	let button0;
    	let t2;
    	let button1;
    	let t4;
    	let button2;
    	let t6;
    	let button3;
    	let t8;
    	let button4;
    	let t10;
    	let button5;
    	let t12;
    	let t13;
    	let div2;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let current;
    	let mounted;
    	let dispose;
    	let if_block = /*roll*/ ctx[3] && create_if_block_1(ctx);
    	let each_value = /*characters*/ ctx[5];
    	validate_each_argument(each_value);
    	const get_key = ctx => /*char*/ ctx[41].id;
    	validate_each_keys(ctx, each_value, get_each_context, get_key);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			img = element("img");
    			t0 = space();
    			button0 = element("button");
    			button0.textContent = "Força";
    			t2 = space();
    			button1 = element("button");
    			button1.textContent = "Destreza";
    			t4 = space();
    			button2 = element("button");
    			button2.textContent = "Constituição";
    			t6 = space();
    			button3 = element("button");
    			button3.textContent = "Carisma";
    			t8 = space();
    			button4 = element("button");
    			button4.textContent = "Inteligência";
    			t10 = space();
    			button5 = element("button");
    			button5.textContent = "Percepção";
    			t12 = space();
    			if (if_block) if_block.c();
    			t13 = space();
    			div2 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(img, "id", "image");
    			attr_dev(img, "class", "avatar");
    			if (!src_url_equal(img.src, img_src_value = "")) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file, 298, 6, 7961);
    			attr_dev(button0, "class", "choseButton");
    			attr_dev(button0, "id", "força");
    			add_location(button0, file, 299, 6, 8015);
    			attr_dev(button1, "class", "choseButton");
    			attr_dev(button1, "id", "destreza");
    			add_location(button1, file, 304, 6, 8152);
    			attr_dev(button2, "class", "choseButton");
    			attr_dev(button2, "id", "constituição");
    			add_location(button2, file, 309, 6, 8298);
    			attr_dev(button3, "class", "choseButton");
    			attr_dev(button3, "id", "carisma");
    			add_location(button3, file, 315, 6, 8465);
    			attr_dev(button4, "class", "choseButton");
    			attr_dev(button4, "id", "inteligencia");
    			add_location(button4, file, 320, 6, 8608);
    			attr_dev(button5, "class", "choseButton");
    			attr_dev(button5, "id", "percepção");
    			add_location(button5, file, 326, 6, 8775);
    			attr_dev(div0, "class", "choseButtons");
    			add_location(div0, file, 297, 4, 7928);
    			attr_dev(div1, "class", "chose");
    			attr_dev(div1, "id", "chose");
    			add_location(div1, file, 296, 2, 7867);
    			attr_dev(div2, "class", "main");
    			add_location(div2, file, 350, 2, 9333);
    			add_location(main, file, 295, 0, 7858);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			append_dev(main, div1);
    			append_dev(div1, div0);
    			append_dev(div0, img);
    			append_dev(div0, t0);
    			append_dev(div0, button0);
    			append_dev(div0, t2);
    			append_dev(div0, button1);
    			append_dev(div0, t4);
    			append_dev(div0, button2);
    			append_dev(div0, t6);
    			append_dev(div0, button3);
    			append_dev(div0, t8);
    			append_dev(div0, button4);
    			append_dev(div0, t10);
    			append_dev(div0, button5);
    			append_dev(main, t12);
    			if (if_block) if_block.m(main, null);
    			append_dev(main, t13);
    			append_dev(main, div2);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div2, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button0, "click", /*click_handler*/ ctx[15], false, false, false),
    					listen_dev(button1, "click", /*click_handler_1*/ ctx[16], false, false, false),
    					listen_dev(button2, "click", /*click_handler_2*/ ctx[17], false, false, false),
    					listen_dev(button3, "click", /*click_handler_3*/ ctx[18], false, false, false),
    					listen_dev(button4, "click", /*click_handler_4*/ ctx[19], false, false, false),
    					listen_dev(button5, "click", /*click_handler_5*/ ctx[20], false, false, false),
    					listen_dev(div1, "click", /*closeSelection*/ ctx[8], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (/*roll*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty[0] & /*roll*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block_1(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(main, t13);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (dirty[0] & /*sanidadeMais, characters, sanidadeMenos, cura, dano, statusvalue, jogarDadoPrimario, change*/ 31856) {
    				each_value = /*characters*/ ctx[5];
    				validate_each_argument(each_value);
    				group_outros();
    				validate_each_keys(ctx, each_value, get_each_context, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value, each_1_lookup, div2, outro_and_destroy_block, create_each_block, null, get_each_context);
    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			if (if_block) if_block.d();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}

    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let characters;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	const define = () => {
    		if (localStorage.yes == undefined) {
    			localStorage.yes = 'yes';
    			localStorage.vidaB = '50';
    			localStorage.vidaC = '33';
    			localStorage.vidaE = '46';
    			localStorage.vidaF = '33';
    			localStorage.vidaL = '50';
    			localStorage.vidaM = '46';
    			localStorage.vidaN = '50';
    			localStorage.vidaZ = '64';
    			localStorage.sanidadeB = '20';
    			localStorage.sanidadeC = '20';
    			localStorage.sanidadeE = '20';
    			localStorage.sanidadeF = '20';
    			localStorage.sanidadeL = '20';
    			localStorage.sanidadeM = '20';
    			localStorage.sanidadeN = '20';
    			localStorage.sanidadeZ = '20';
    		}
    	};

    	define();

    	const d20 = number => {
    		var arr = [];

    		while (arr.length < number) {
    			var r = Math.floor(Math.random() * 20) + 1;
    			arr.push(r);
    		}

    		let dadoCerto = arr.reduce((a, b) => a + b, 0);

    		let ordem = arr.sort(function (a, b) {
    			return b - a;
    		});

    		return [dadoCerto, ordem];
    	};

    	let dadoPrimario = undefined;
    	let charId = undefined;
    	let charAtributo = undefined;
    	let atributoSecundario = undefined;
    	let dadoCerto = 0;
    	let sequencia = 0;
    	let modificador = 0;

    	const jogarDadoPrimario = (number, id, atributo) => {
    		openSelection();
    		dadoPrimario = number + 1;
    		charId = id;
    		charAtributo = atributo;
    		document.getElementById('image').src = characters[id].img;
    		document.getElementById('image').alt = characters[id].name;
    	};

    	const jogarDadoSecundario = elem => {
    		atributoSecundario = elem;
    		let segundoStatus = characters[charId][elem];

    		if (atributoSecundario == charAtributo) {
    			//se ambos forem do msm atributo
    			if (dadoPrimario != -1) {
    				let dado = d20(dadoPrimario);
    				let lista = dado[1];
    				$$invalidate(0, dadoCerto = lista[0]);
    				$$invalidate(1, sequencia = lista);
    				$$invalidate(2, modificador = 0);
    			} else {
    				let dado = d20(2);
    				let lista = dado[1];
    				$$invalidate(0, dadoCerto = lista[1]);
    				$$invalidate(1, sequencia = lista);
    				$$invalidate(2, modificador = 0);
    			}
    		} else {
    			if (dadoPrimario != -1) {
    				let dado = d20(dadoPrimario);
    				let lista = dado[1];
    				$$invalidate(0, dadoCerto = parseInt(lista[0]) + segundoStatus);
    				$$invalidate(1, sequencia = lista);
    				$$invalidate(2, modificador = segundoStatus);
    			} else {
    				let dado = d20(2);
    				let lista = dado[1];
    				$$invalidate(0, dadoCerto = parseInt(lista[1]) + segundoStatus);
    				$$invalidate(1, sequencia = lista);
    				$$invalidate(2, modificador = segundoStatus);
    			}
    		}

    		turnOn();
    	};

    	const openSelection = () => document.getElementById('chose').style.display = 'flex';
    	const closeSelection = () => document.getElementById('chose').style.display = 'none';
    	var roll = false;
    	const turnOn = () => $$invalidate(3, roll = true);
    	const turnOff = () => $$invalidate(3, roll = false);

    	const change = id => {
    		if (characters[id]['open'] == true) {
    			$$invalidate(5, characters[id]['open'] = false, characters);
    		} else {
    			$$invalidate(5, characters[id]['open'] = true, characters);
    		}
    	};

    	var statusvalue = undefined;

    	const dano = (name, id) => {
    		if (statusvalue == undefined) {
    			return 0;
    		} else {
    			let nome = name[0];
    			let code = 'vida' + nome;
    			let storage = localStorage.getItem(code);
    			let newValue = parseInt(storage) - statusvalue;
    			localStorage.setItem(code, newValue);
    			$$invalidate(5, characters[id]['life'] = newValue, characters);
    			$$invalidate(4, statusvalue = undefined);
    		}
    	};

    	const cura = (name, id) => {
    		if (statusvalue == undefined) {
    			return 0;
    		} else {
    			let nome = name[0];
    			let code = 'vida' + nome;
    			let storage = localStorage.getItem(code);
    			let newValue = parseInt(storage) + statusvalue;
    			localStorage.setItem(code, newValue);
    			$$invalidate(5, characters[id]['life'] = newValue, characters);
    			$$invalidate(4, statusvalue = undefined);
    		}
    	};

    	const sanidadeMais = (name, id) => {
    		if (statusvalue == undefined) {
    			return 0;
    		} else {
    			let nome = name[0];
    			let code = 'sanidade' + nome;
    			let storage = localStorage.getItem(code);
    			let newValue = parseInt(storage) + statusvalue;
    			localStorage.setItem(code, newValue);
    			$$invalidate(5, characters[id]['sanidade'] = newValue, characters);
    			$$invalidate(4, statusvalue = undefined);
    		}
    	};

    	const sanidadeMenos = (name, id) => {
    		if (statusvalue == undefined) {
    			return 0;
    		} else {
    			let nome = name[0];
    			let code = 'sanidade' + nome;
    			let storage = localStorage.getItem(code);
    			let newValue = parseInt(storage) - statusvalue;
    			localStorage.setItem(code, newValue);
    			$$invalidate(5, characters[id]['sanidade'] = newValue, characters);
    			$$invalidate(4, statusvalue = undefined);
    		}
    	};

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => jogarDadoSecundario('força');
    	const click_handler_1 = () => jogarDadoSecundario('destreza');
    	const click_handler_2 = () => jogarDadoSecundario('constituição');
    	const click_handler_3 = () => jogarDadoSecundario('carisma');
    	const click_handler_4 = () => jogarDadoSecundario('inteligencia');
    	const click_handler_5 = () => jogarDadoSecundario('percepção');
    	const click_handler_6 = char => change(char.id);
    	const click_handler_7 = char => jogarDadoPrimario(char.força, char.id, 'força');
    	const click_handler_8 = char => jogarDadoPrimario(char.destreza, char.id, 'destreza');
    	const click_handler_9 = char => jogarDadoPrimario(char.constituição, char.id, 'constituição');
    	const click_handler_10 = char => jogarDadoPrimario(char.carisma, char.id, 'carisma');
    	const click_handler_11 = char => jogarDadoPrimario(char.inteligencia, char.id, 'inteligencia');
    	const click_handler_12 = char => jogarDadoPrimario(char.percepção, char.id, 'percepção');

    	function input_input_handler() {
    		statusvalue = to_number(this.value);
    		$$invalidate(4, statusvalue);
    	}

    	const click_handler_13 = char => dano(char.name, char.id);
    	const click_handler_14 = char => cura(char.name, char.id);
    	const click_handler_15 = char => sanidadeMenos(char.name, char.id);
    	const click_handler_16 = char => sanidadeMais(char.name, char.id);

    	$$self.$capture_state = () => ({
    		slide,
    		sineInOut,
    		fade,
    		define,
    		d20,
    		dadoPrimario,
    		charId,
    		charAtributo,
    		atributoSecundario,
    		dadoCerto,
    		sequencia,
    		modificador,
    		jogarDadoPrimario,
    		jogarDadoSecundario,
    		openSelection,
    		closeSelection,
    		roll,
    		turnOn,
    		turnOff,
    		change,
    		statusvalue,
    		dano,
    		cura,
    		sanidadeMais,
    		sanidadeMenos,
    		characters
    	});

    	$$self.$inject_state = $$props => {
    		if ('dadoPrimario' in $$props) dadoPrimario = $$props.dadoPrimario;
    		if ('charId' in $$props) charId = $$props.charId;
    		if ('charAtributo' in $$props) charAtributo = $$props.charAtributo;
    		if ('atributoSecundario' in $$props) atributoSecundario = $$props.atributoSecundario;
    		if ('dadoCerto' in $$props) $$invalidate(0, dadoCerto = $$props.dadoCerto);
    		if ('sequencia' in $$props) $$invalidate(1, sequencia = $$props.sequencia);
    		if ('modificador' in $$props) $$invalidate(2, modificador = $$props.modificador);
    		if ('roll' in $$props) $$invalidate(3, roll = $$props.roll);
    		if ('statusvalue' in $$props) $$invalidate(4, statusvalue = $$props.statusvalue);
    		if ('characters' in $$props) $$invalidate(5, characters = $$props.characters);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$invalidate(5, characters = [
    		{
    			name: 'Bartolomeu',
    			força: 4,
    			destreza: 4,
    			constituição: 2,
    			carisma: 1,
    			inteligencia: -1,
    			percepção: 4,
    			life: localStorage.vidaB,
    			totalLife: 50,
    			sanidade: localStorage.sanidadeB,
    			sanidadeTotal: 20,
    			img: 'https://cdn.discordapp.com/attachments/831176302279000174/1017121614258778206/Bartolomeu.jpeg',
    			open: false,
    			id: 0
    		},
    		{
    			name: 'Ciara',
    			força: 1,
    			destreza: 2,
    			constituição: 2,
    			carisma: 3,
    			inteligencia: 4,
    			percepção: 3,
    			life: localStorage.vidaC,
    			totalLife: 33,
    			sanidade: localStorage.sanidadeC,
    			sanidadeTotal: 20,
    			img: 'https://cdn.discordapp.com/attachments/831176302279000174/1017121616146219030/Ciara.jpeg',
    			open: false,
    			id: 1
    		},
    		{
    			name: 'Eris',
    			força: 4,
    			destreza: 4,
    			constituição: 2,
    			carisma: 1,
    			inteligencia: 1,
    			percepção: 3,
    			life: localStorage.vidaE,
    			totalLife: 46,
    			sanidade: localStorage.sanidadeE,
    			sanidadeTotal: 20,
    			img: 'https://cdn.discordapp.com/attachments/831176302279000174/1017121613994524713/Eris.jpeg',
    			open: false,
    			id: 2
    		},
    		{
    			name: 'Feather',
    			força: 1,
    			destreza: 2,
    			constituição: 3,
    			carisma: 4,
    			inteligencia: 3,
    			percepção: 2,
    			life: localStorage.vidaF,
    			totalLife: 33,
    			sanidade: localStorage.sanidadeF,
    			sanidadeTotal: 20,
    			img: 'https://cdn.discordapp.com/attachments/831176302279000174/1017121614493651014/Feather.jpeg',
    			open: false,
    			id: 3
    		},
    		{
    			name: 'Lilith',
    			força: 1,
    			destreza: 2,
    			constituição: 3,
    			carisma: 4,
    			inteligencia: 3,
    			percepção: 2,
    			life: localStorage.vidaL,
    			totalLife: 50,
    			sanidade: localStorage.sanidadeL,
    			sanidadeTotal: 20,
    			img: 'https://cdn.discordapp.com/attachments/831176302279000174/1017121615911329863/Lilith.jpeg',
    			open: false,
    			id: 4
    		},
    		{
    			name: 'Mina',
    			força: 3,
    			destreza: 3,
    			constituição: 3,
    			carisma: 1,
    			inteligencia: 2,
    			percepção: 3,
    			life: localStorage.vidaM,
    			totalLife: 46,
    			sanidade: localStorage.sanidadeM,
    			sanidadeTotal: 20,
    			img: 'https://cdn.discordapp.com/attachments/831176302279000174/1017121615529660476/Mina.jpeg',
    			open: false,
    			id: 5
    		},
    		{
    			name: 'Níxis',
    			força: 3,
    			destreza: 3,
    			constituição: 3,
    			carisma: 3,
    			inteligencia: 4,
    			percepção: 3,
    			life: localStorage.vidaN,
    			totalLife: 50,
    			sanidade: localStorage.sanidadeN,
    			sanidadeTotal: 20,
    			img: 'https://www.istoedinheiro.com.br/wp-content/uploads/sites/17/2022/02/tilapia-e1645622421681.jpg',
    			open: false,
    			id: 6
    		},
    		{
    			name: 'Zumbão',
    			força: 4,
    			destreza: 4,
    			constituição: 3,
    			carisma: 3,
    			inteligencia: -1,
    			percepção: 1,
    			life: localStorage.vidaZ,
    			totalLife: 64,
    			sanidade: localStorage.sanidadeZ,
    			sanidadeTotal: 20,
    			img: 'https://cdn.discordapp.com/attachments/831176302279000174/1017121616452391013/Zumbao.jpeg',
    			open: false,
    			id: 7
    		}
    	]);

    	return [
    		dadoCerto,
    		sequencia,
    		modificador,
    		roll,
    		statusvalue,
    		characters,
    		jogarDadoPrimario,
    		jogarDadoSecundario,
    		closeSelection,
    		turnOff,
    		change,
    		dano,
    		cura,
    		sanidadeMais,
    		sanidadeMenos,
    		click_handler,
    		click_handler_1,
    		click_handler_2,
    		click_handler_3,
    		click_handler_4,
    		click_handler_5,
    		click_handler_6,
    		click_handler_7,
    		click_handler_8,
    		click_handler_9,
    		click_handler_10,
    		click_handler_11,
    		click_handler_12,
    		input_input_handler,
    		click_handler_13,
    		click_handler_14,
    		click_handler_15,
    		click_handler_16
    	];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {}, null, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		name: 'Filipe'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
