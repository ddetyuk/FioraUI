cm.define('Com.GalleryPopup', {
    'modules' : [
        'Params',
        'DataConfig',
        'Events',
        'Stack'
    ],
    'events' : [
        'onOpen',
        'onClose',
        'onChange'
    ],
    'params' : {
        'node' : cm.Node('div'),
        'name' : '',
        'size' : 'fullscreen',                   // fullscreen | auto
        'aspectRatio' : 'auto',                  // auto | 1x1 | 4x3 | 3x2 | 16x10 | 16x9 | 2x1 | 21x9 | 35x10 | 3x4 | 2x3 | 10x16 | 9x16 | 1x2
        'theme' : 'theme-black',
        'showCounter' : true,
        'showTitle' : true,
        'data' : [],
        'openOnSelfClick' : false,
        'Com.Dialog' : {
            'width' : '700',
            'autoOpen' : false,
            'titleOverflow' : true,
            'closeOnBackground' : true,
            'className' : 'com__gallery-popup'
        },
        'Com.Gallery' : {
            'showCaption' : false
        }
    }
},
function(params){
    var that = this,
        nodes = {},
        components = {};

    var init = function(){
        that.setParams(params);
        that.convertEvents(that.params['events']);
        that.getDataConfig(that.params['node']);
        that.addToStack(that.params['node']);
        validateParams();
        render();
        setLogic();
    };

    var validateParams = function(){
        that.params['Com.Dialog']['theme'] = that.params['theme'];
        that.params['Com.Dialog']['size'] = that.params['size'];
        if(that.params['size'] == 'fullscreen'){
            that.params['Com.Dialog']['documentScroll'] = false;
        }
    };

    var render = function(){
        // Structure
        nodes['container'] = cm.Node('div', {'class' : 'com__gallery-preview bottom'},
            nodes['galleryContainer'] = cm.Node('div', {'class' : 'inner'})
        );
        // Set aspect ration
        if(that.params['aspectRatio'] != 'auto'){
            cm.addClass(nodes['container'], ['cm__aspect', that.params['aspectRatio']].join('-'))
        }
    };

    var setLogic = function(){
        // Dialog
        components['dialog'] = new Com.Dialog(
                cm.merge(that.params['Com.Dialog'], {
                    'content' : nodes['container']
                })
            )
            .addEvent('onOpen', function(){
                cm.addEvent(window, 'keydown', keyboardEvents);
                that.triggerEvent('onOpen');
            })
            .addEvent('onClose', function(){
                components['gallery'].stop();
                cm.removeEvent(window, 'keydown', keyboardEvents);
                that.triggerEvent('onClose');
            });
        // Gallery
        components['gallery'] = new Com.Gallery(
                cm.merge(that.params['Com.Gallery'], {
                    'node' : that.params['node'],
                    'container' : nodes['galleryContainer'],
                    'data' : that.params['data']
                })
            )
            .addEvent('onSet', components['dialog'].open)
            .addEvent('onChange', onChange);
        // Node's self click
        if(that.params['openOnSelfClick']){
            cm.addEvent(that.params['node'], 'click', that.open);
        }
    };

    var onChange = function(gallery, data){
        var title;
        // Set caption
        if(that.params['showCounter']){
            title = [(data['current']['index'] + 1), gallery.getCount()].join('/');
        }
        if(that.params['showTitle']){
            if(that.params['showCounter']){
                if(!cm.isEmpty(data['current']['title'])){
                    title = [title, data['current']['title']].join(' - ');
                }
            }else{
                title = data['current']['title'];
            }
        }
        if(that.params['showCounter'] || that.params['showTitle']){
            components['dialog'].setTitle(title);
        }
        that.triggerEvent('onChange', data);
    };

    var keyboardEvents = function(e){
        e = cm.getEvent(e);
        switch(e.keyCode){
            case 37:
                components['gallery'].prev();
                break;
            case 39:
                components['gallery'].next();
                break;
        }
    };

    /* ******* MAIN ******* */

    that.open = function(){
        that.set(0);
        return that;
    };

    that.close = function(){
        components['dialog'].close();
        return that;
    };

    that.set = function(i){
        components['gallery'].set(i);
        return that;
    };

    that.next = function(){
        components['gallery'].next();
        return that;
    };

    that.prev = function(){
        components['gallery'].prev();
        return that;
    };

    init();
});