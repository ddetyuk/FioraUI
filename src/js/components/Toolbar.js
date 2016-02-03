cm.define('Com.Toolbar', {
    'modules' : [
        'Params',
        'Events',
        'Langs',
        'Structure',
        'DataConfig',
        'DataNodes',
        'Stack'
    ],
    'events' : [
        'onRenderStart',
        'onRender',
        'onProcessEnd'
    ],
    'params' : {
        'node' : cm.node('div'),
        'container' : null,
        'name' : '',
        'embedStructure' : 'append',
        'flex' : false
    }
},
function(params){
    var that = this;

    that.nodes = {};
    that.groups = {};

    var init = function(){
        that.setParams(params);
        that.convertEvents(that.params['events']);
        that.getDataNodes(that.params['node']);
        that.getDataConfig(that.params['node']);
        that.addToStack(that.params['node']);
        that.triggerEvent('onRenderStart');
        render();
        that.addToStack(that.nodes['container']);
        that.triggerEvent('onRender');
    };

    var render = function(){
        // Structure
        that.nodes['container'] = cm.node('div', {'class' : 'com__toolbar'},
            that.nodes['part'] = cm.node('div', {'class' : 'pt__toolbar'},
                cm.node('div', {'class' : 'inner clear'},
                    that.nodes['left'] = cm.node('div', {'class' : 'left'}),
                    that.nodes['right'] = cm.node('div', {'class' : 'right'})
                )
            )
        );
        that.params['flex'] && cm.addClass(that.nodes['part'], 'is-adaptive');
        // Append
        that.embedStructure(that.nodes['container']);
    };

    /* ******* PUBLIC ******* */

    that.clear = function(){
        cm.forEach(that.groups, function(group){
            that.removeGroup(group);
        });
        that.triggerEvent('onProcessEnd');
        return that;
    };

    that.addGroup = function(item){
        item = cm.merge({
            'container' : cm.node('ul', {'class' : 'group'}),
            'node' : null,
            'adaptive' : true,
            'name' : '',
            'position' : 'left',
            'items' : {}
        }, item);
        if(!that.groups[item['name']]){
            if(!item['node']){
                item['node'] = item['container'];
            }
            item['adaptive'] && cm.addClass(item['container'], 'is-adaptive');
            if(/left|right/.test(item['position'])){
                cm.appendChild(item['container'], that.nodes[item['position']]);
            }
            that.groups[item['name']] = item;
        }
        that.triggerEvent('onProcessEnd');
        return that;
    };

    that.getGroup = function(name){
        return that.groups[name];
    };

    that.removeGroup = function(name){
        var item;
        if(cm.isObject(arguments[0])){
            item = name;
        }else{
            item = that.groups[name];
        }
        if(item){
            cm.remove(item['container']);
            delete that.groups[item['name']];
        }
        that.triggerEvent('onProcessEnd');
        return that;
    };

    that.addButton = function(item){
        var group;
        item = cm.merge({
            'container' : cm.node('li'),
            'node' : cm.node('div', {'class' : 'button'}),
            'name' : '',
            'label' : '',
            'title' : '',
            'group' : '',
            'handler' : function(){}
        }, item);
        if((group = that.groups[item['group']]) && !group.items[item['name']]){
            item['node'].innerHTML = item['label'];
            item['node'].title = item['title'];
            cm.addEvent(item['node'], 'click', function(e){
                cm.preventDefault(e);
                item['handler'](e, item);
            });
            cm.appendChild(item['node'], item['container']);
            cm.appendChild(item['container'], group['node']);
            group.items[item['name']] = item;
        }
        that.triggerEvent('onProcessEnd');
        return that;
    };

    that.getButton = function(name, groupName){
        var item, group;
        if((group = that.groups[groupName]) && (item = group.items[name])){
            return item;
        }
        return null;
    };

    that.removeButton = function(name, groupName){
        var item, group;
        if(cm.isObject(arguments[0])){
            item = name;
            group = that.groups[item['group']];
        }else if(group = that.groups[groupName]){
            item = group.items[name];
        }
        if(item){
            cm.remove(item['container']);
            delete group.items[item['name']];
        }
        that.triggerEvent('onProcessEnd');
        return that;
    };

    init();
});