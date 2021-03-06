cm.define('Com.Sortable', {
    'modules' : [
        'Params',
        'Events',
        'DataConfig',
        'DataNodes'
    ],
    'events' : [
        'onRender',
        'onRemove',
        'onSort'
    ],
    'params' : {
        'node' : cm.Node('div'),
        'Com.Draganddrop' : {}
    }
},
function(params){
    var that = this;

    that.components = {};
    that.nodes = {
        'groups' : []
    };

    var init = function(){
        that.setParams(params);
        that.convertEvents(that.params['events']);
        that.getDataNodes(that.params['node']);
        that.getDataConfig(that.params['node']);
        render();
    };

    var render = function(){
        // Init drag'n'drop class
        that.components['dd'] = new Com.Draganddrop(
                cm.merge(that.params['Com.Draganddrop'], {
                    'draggableContainer' : that.params['draggableContainer'],
                    'direction' : that.params['direction'],
                    'limit' : that.params['limit']
                })
            )
            .addEvent('onRemove', onRemove)
            .addEvent('onDrop', onSort);
        // Process items
        cm.forEach(that.nodes['groups'], process);
        // Trigger render event
        that.triggerEvent('onRender');
    };

    var onRemove = function(dd, widget){
        that.triggerEvent('onRemove', widget);
    };

    var onSort = function(dd, widget){
        that.triggerEvent('onSort', widget);
    };

    var process = function(group){
        if(group['container']){
            // Register group node
            that.addGroup(group['container']);
            // Register group's items
            if(group['items']){
                cm.forEach(group['items'], function(item){
                    processItem(item, group);
                });
            }
        }
    };

    var processItem = function(item, group){
        // Register item
        that.addItem(item['container'], group['container']);
        // Register sub groups
        if(item['groups']){
            cm.forEach(item['groups'], process);
        }
    };

    /* ******* MAIN ******* */

    that.addGroup = function(group){
        that.components['dd'].registerArea(group);
        return that;
    };

    that.removeGroup = function(group){
        that.components['dd'].removeArea(group);
        return that;
    };

    that.addItem = function(item, group){
        var nodes = cm.getNodes(item);
        if(nodes['items'][0]['drag']){
            nodes['items'][0]['drag'].setAttribute('data-com-draganddrop', 'drag');
        }
        that.components['dd'].registerDraggable(item, group);
        return that;
    };

    that.removeItem = function(item){
        that.components['dd'].removeDraggable(item);
        return that;
    };

    init();
});