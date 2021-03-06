cm.define('Com.GalleryLayout', {
    'modules' : [
        'Params',
        'Events',
        'DataConfig',
        'DataNodes'
    ],
    'events' : [
        'onRender',
        'onChange'
    ],
    'params' : {
        'node' : cm.Node('div'),
        'barDirection' : 'horizontal',      // horizontal | vertical
        'hasBar' : true,
        'Com.Gallery' : {},
        'Com.Scroll' : {
            'step' : 25,
            'time' : 25
        }
    }
},
function(params){
    var that = this,
        components = {},
        items = [];
    
    that.nodes = {
        'inner' : cm.Node('div'),
        'preview-inner' : cm.Node('div'),
        'bar-inner' : cm.Node('div'),
        'bar-items' : []
    };

    /* *** CLASS FUNCTIONS *** */

    var init = function(){
        that.setParams(params);
        that.convertEvents(that.params['events']);
        that.getDataNodes(that.params['node'], that.params['nodesDataMarker'], false);
        that.getDataConfig(that.params['node']);
        collectItems();
        render();
    };

    var render = function(){
        // Scroll
        components['scroll'] = new Com.Scroll(
            cm.merge(that.params['Com.Scroll'], {
                'nodes' : that.nodes['ComScroll']
            })
        );
        // Gallery
        components['gallery'] = new Com.Gallery(
                cm.merge(that.params['Com.Gallery'], {
                    'container' : that.nodes['preview-inner'],
                    'data' : items
                })
            )
            .addEvent('onChange', onChange)
            .set(0);
        // API onRender event
        that.triggerEvent('onRender');
    };

    var collectItems = function(){
        cm.forEach(that.nodes['bar-items'], function(item){
            item['title'] = item['link']? item['link'].getAttribute('title') || '' : '';
            item['src'] = item['link']? item['link'].getAttribute('href') || '' : '';
            items.push(item);
        });
    };

    var onChange = function(gallery, data){
        var item = data['current'],
            left,
            top;
        
        if(that.params['hasBar']){
            // Thumbs classes
            if(data['previous']){
                cm.removeClass(data['previous']['container'], 'active');
            }
            cm.addClass(item['container'], 'active');
            // Move bar
            if(that.params['barDirection'] == 'vertical'){
                top = item['container'].offsetTop - (that.nodes['inner'].offsetHeight / 2) + (item['container'].offsetHeight / 2);
                components['scroll'].scrollY(top);
            }else{
                left = item['container'].offsetLeft - (that.nodes['inner'].offsetWidth / 2) + (item['container'].offsetWidth / 2);
                components['scroll'].scrollX(left);
            }
        }
        // API onSet event
        that.triggerEvent('onChange', data);
    };

    /* ******* MAIN ******* */

    init();
});