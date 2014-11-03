/*!
 * B-JUI v1.0 (http://b-jui.com)
 * Git@OSC (http://git.oschina.net/xknaan/B-JUI)
 * Copyright 2014 K'naan (xknaan@163.com).
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 */

/* ========================================================================
 * B-JUI: plugins.js v1.0
 * @author K'naan (xknaan@163.com)
 * http://git.oschina.net/xknaan/B-JUI/blob/master/BJUI/js/plugins.js
 * ========================================================================
 * Copyright 2014 K'naan.
 * Licensed under Apache (http://www.apache.org/licenses/LICENSE-2.0)
 * ======================================================================== */

+function ($) {
    'use strict';
    
    $(document).on(BJUI.eventType.initUI, function(e) {
        var $box    = $(e.target)
        
        // UI init begin...
        
        /* i-check */
        var $icheck = $box.find('[data-toggle="icheck"]')
        
        $icheck.each(function(i) {
            var $element = $(this),
                id       = $element.attr('id'),
                name     = $element.attr('name'),
                label    = $element.data('label')
                
            if (label) $element.after('<label for="'+ id +'" class="ilabel">'+ label +'</label>')
            
            $element
                .on('ifCreated', function(e) {
                    /* Fixed validate msgbox position */
                    var $parent = $(this).closest('div'),
                        $ilabel = $parent.next('[for="'+ id +'"]')
                    
                    $parent.attr('data-icheck', name)
                    $ilabel.attr('data-icheck', name)
                })
                .iCheck({
                    checkboxClass: 'icheckbox_minimal-purple',
                    radioClass: 'iradio_minimal-purple',
                    increaseArea: '20%' // optional
                })
                .on('ifChanged', function() {
                    /* Trigger validation */
                    if ($(this).closest('div').attr('aria-checked')) {
                        $(this).trigger('validate')
                    }
                })
            
            if ($element.prop('disabled')) $element.iCheck('disable')
        })
        /* i-check check all */
        $icheck.filter('.checkboxCtrl').on('ifChanged', function(e) {
            var checked = e.target.checked == true ? 'check' : 'uncheck'
            var group = $(this).data('group')
            
            $box.find(':checkbox[name="'+ group +'"]').iCheck(checked)
        })
        
        /* fixed ui style */
        $box.find(':text, :password, textarea, :button, a.btn').each(function() {
            var $element = $(this), $tabledit = $element.closest('table.bjui-tabledit')
            
            if (($element.is(':text') || $element.is(':password') || $element.isTag('textarea')) && !$element.hasClass('form-control'))
                $element.addClass('form-control')
            if ($element.is(':button')) {
                var icon = $element.data('icon'), large = $element.data('large'), oldClass = $element.attr('class')
                
                if (!$element.hasClass('btn')) 
                    $element.removeClass().addClass('btn').addClass(oldClass)
                if (icon)   $element.html('<i class="fa fa-'+ icon.replace('fa-', '') +'"></i> '+ $element.html())
                //if (!$element.hasClass('btn-sm') || !$element.hasClass('btn-nm') || !$element.hasClass('btn-lg')) $element.addClass('btn-sm')
            }
            if ($element.isTag('a')) {
                var icon = $element.data('icon'), large = $element.data('large')
                
                if (icon)   $element.html('<i class="fa fa-'+ icon +'"></i> '+ $element.html())
                //if (!$element.hasClass('btn-sm') || !$element.hasClass('btn-nm') || !$element.hasClass('btn-lg')) $element.addClass('btn-sm')
            }
            if ($element.isTag('textarea')) {
                var toggle = $element.data('toggle')
                
                if (toggle && toggle == 'autoheight' && $.fn.autosize) $element.addClass('autosize').autosize()
            }
            if (!$tabledit.length) {
                var size = $element.attr('size') || $element.attr('cols'), width = size * 10
                
                if (!size) return
                if (width) $element.css('width', width)
            }
        })
        
        /* form validate */
        $box.find('form[data-toggle="validate"]').each(function() {
            var $element = $(this)
            var callback = $element.data('callback')

            if (!$element.attr('method')) $element.attr('method', 'POST')
            if (callback) callback = callback.toFunc()
            
            $element
                .validator({
                    valid: function(form) {
                        $element.bjuiajax('ajaxForm', callback)
                        return false
                    },
                    validClass: 'ok',
                    theme: 'red_right_effect'
                })
                .on('invalid.form', function(e, form, errors) {
                    $element.alertmsg('error', FRAG.validateErrorMsg.replace('#validatemsg#', BJUI.regional.validatemsg).replaceMsg(errors.length))
                    return false
                })
        })
        
        /* moreSearch */
        $box.find('a[data-toggle="moresearch"]').each(function() {
            var $element = $(this),
                $parent  = $element.closest('.bjui-pageHeader'),
                $more    = $parent && $parent.find('.bjui-moreSearch'),
                name     = $element.data('name')
                
            $element.click(function(e) {
                if (!$more.length) {
                    BJUI.debug('Not created \'moresearch\' box[class="bjui-moreSearch"]!')
                    return
                }
                if ($more.is(':visible')) {
                    $element.html('<i class="fa fa-angle-double-down"></i>')
                    if (name) $('body').data('moresearch.'+ name, false)
                } else {
                    $element.html('<i class="fa fa-angle-double-up"></i>')
                    if (name) $('body').data('moresearch.'+ name, true)
                }
                $more.fadeToggle('slow', 'linear')
                
                e.preventDefault()
            })
            
            if (name && $('body').data('moresearch.'+ name)) {
                $more.fadeIn()
                $element.html('<i class="fa fa-angle-double-up"></i>')
            }
        })
        
        /* bootstrap - select */
        var $selectpicker = $box.find('select[data-toggle="selectpicker"]')
        
        $selectpicker.each(function() {
            var $element  = $(this)
            var style     = $element.attr('data-style')
            var width     = $element.attr('data-width')
            var container = $element.attr('data-container')
            
            $element.addClass('show-tick')
            if (!style) $element.attr('data-style', 'btn-default')
            if (!width) $element.attr('data-width', 'auto')
            if (!container) $element.attr('data-container', 'body')
            
            $element.selectpicker()
        })
        
        /* bootstrap - select - linkage && Trigger validation */
        $selectpicker.change(function() {
            var $element    = $(this)
            var $nextselect = $($element.data('nextselect'))
            var refurl      = $element.data('refurl')
            var _setEmpty   = function($select) {
                var $_nextselect = $($select.data('nextselect'))
                
                if ($_nextselect && $_nextselect.length) {
                    var emptytxt = $_nextselect.data('emptytxt') || '&nbsp;'
                    
                    $_nextselect.html('<option>'+ emptytxt +'</option>').selectpicker('refresh')
                    _setEmpty($_nextselect)
                }
            }
            
            if (($nextselect && $nextselect.length) && refurl) {
                $.ajax({
                    type     : 'POST', 
                    dataType : 'json', 
                    url      : refurl.replace('{value}', encodeURIComponent($element.val())), 
                    cache    : false,
                    data     : {},
                    success  : function(json) {
                        if (!json) return
                        
                        var html = ''
                        
                        $.each(json, function(i) {
                            if (json[i] && json[i].length > 1) {
                                html += '<option value="'+json[i][0]+'">' + json[i][1] + '</option>'
                            }
                        })
                        
                        if (!html) {
                            html = $nextselect.data('emptytxt') || '&nbsp;'
                            html = '<option>'+ html +'</option>'
                        }
                        
                        $nextselect.html(html).selectpicker('refresh')
                        _setEmpty($nextselect)
                    },
                    error   : BJUI.ajaxError
                })
            }
            
            /* Trigger validation */
            if ($element.attr('aria-required')) {
                $element.trigger('validate')
            }
        })
        
        /* zTree - plugin */
        $box.find('[data-toggle="ztree"]').each(function() {
            var $this = $(this)
            var op    = $this.data()
            
            if (!op.nodes) {
                op.nodes = []
                $this.find('> li').each(function() {
                    var $li   = $(this)
                    var node  = $li.data()
                    
                    if (node.pid) node.pId = node.pid
                    node.name = $li.html()
                    op.nodes.push(node)
                })
                $this.empty()
            }
            
            if (!op.showRemoveBtn) op.showRemoveBtn = false
            if (!op.showRenameBtn) op.showRenameBtn = false
            if (op.addHoverDom && typeof op.addHoverDom != 'function')       op.addHoverDom    = (op.addHoverDom == 'edit')    ? _addHoverDom    : op.addHoverDom.toFunc()
            if (op.removeHoverDom && typeof op.removeHoverDom != 'function') op.removeHoverDom = (op.removeHoverDom == 'edit') ? _removeHoverDom : op.removeHoverDom.toFunc()
            if (!op.maxAddLevel)   op.maxAddLevel    = 2
            
            var setting = {
                view: {
                    addHoverDom    : op.addHoverDom || null,
                    removeHoverDom : op.removeHoverDom || null,
                    addDiyDom      : (op.addDiyDom != null) ? op.addDiyDom.toFunc() : null
                },
                edit: {
                    enable        : op.editEnable,
                    showRemoveBtn : op.showRemoveBtn,
                    showRenameBtn : op.showRenameBtn
                },
                check: {
                    enable    : op.checkEnable,
                    chkStyle  : op.chkStyle,
                    radioType : op.radioType
                },
                callback: {
                    onClick      : op.onClick      != null ? op.onClick.toFunc()      : null,
                    beforeDrag   : op.beforeDrag   != null ? op.beforeDrag.toFunc()   : _beforeDrag,
                    beforeDrop   : op.beforeDrop   != null ? op.beforeDrop.toFunc()   : _beforeDrop,
                    onDrop       : op.onDrop       != null ? op.onDrop.toFunc()       : null,
                    onCheck      : op.onCheck      != null ? op.onCheck.toFunc()      : null,
                    beforeRemove : op.beforeRemove != null ? op.beforeRemove.toFunc() : null,
                    onRemove     : op.onRemove     != null ? op.onRemove.toFunc()     : null
                },
                data: {
                    simpleData: {
                        enable: op.simpleData || true
                    }
                }
            }
            
            $.fn.zTree.init($this, setting, op.nodes)
            
            var IDMark_A = '_a'
            var zTree = $.fn.zTree.getZTreeObj($this.attr('id'))
            
            if (op.expandAll) zTree.expandAll(true)
            
            // add button, del button
            function _addHoverDom(treeId, treeNode) {
                var level = treeNode.level
                var $obj = $('#'+ treeNode.tId + IDMark_A)
                var $add = $('#diyBtn_add_'+ treeNode.id)
                var $del = $('#diyBtn_del_'+ treeNode.id)
                
                if (!$add.length) {
                    if (level < op.maxAddLevel) {
                        $add = $('<span class="tree_add" id="diyBtn_add_'+ treeNode.id +'" title="添加"></span>')
                        $add.appendTo($obj);
                        $add.on('click', function(){
                            zTree.addNodes(treeNode, {name:'新增Item'})
                        })
                    }
                }
                
                if (!$del.length) {
                    var $del = $('<span class="tree_del" id="diyBtn_del_'+ treeNode.id +'" title="删除"></span>')
                    
                    $del
                        .appendTo($obj)
                        .on('click', function(event) {
                            var delFn = function() {
                                $del.alertmsg('confirm', '确认要删除 '+ treeNode.name +' 吗？', {
                                    okCall: function() {
                                        zTree.removeNode(treeNode)
                                        if (op.onRemove) {
                                            var fn = op.onRemove.toFunc()
                                            
                                            if (fn) fn.call(this, event, treeId, treeNode)
                                        }
                                    },
                                    cancelCall: function () {
                                        return
                                    }
                                })
                            }
                        
                            if (op.beforeRemove) {
                                var fn = op.beforeRemove.toFunc()
                                
                                if (fn) {
                                    var isdel = fn.call(fn, treeId, treeNode)
                                    
                                    if (isdel && isdel == true) delFn()
                                }
                            } else {
                                delFn()
                            }
                        }
                    )
                }
            }
            
            // remove add button && del button
            function _removeHoverDom(treeId, treeNode) {
                var $add = $('#diyBtn_add_'+ treeNode.id)
                var $del = $('#diyBtn_del_'+ treeNode.id)
                
                if ($add && $add.length) {
                    $add.off('click').remove()
                }
                
                if ($del && $del.length) {
                    $del.off('click').remove()
                }
            }
            
            // Drag
            function _beforeDrag(treeId, treeNodes) {
                for (var i = 0; i < treeNodes.length; i++) {
                    if (treeNodes[i].drag === false) {
                        return false
                    }
                }
                return true
            }
            
            function _beforeDrop(treeId, treeNodes, targetNode, moveType) {
                return targetNode ? targetNode.drop !== false : true
            }
            
            if (op.onClick)
                $this.find('li > a').click(function(e) { e.preventDefault() })
        })
        
        /* zTree - drop-down selector */
        var $selectzTree = $box.find('[data-toggle="selectztree"]')
        
        $selectzTree.each(function() {
            var $this   = $(this)
            var options = $this.data(),
                $tree   = $(options.tree),
                w       = parseFloat($this.css('width')),
                h       = $this.outerHeight()
            
            options.width   = options.width || $this.outerWidth()
            options.height  = options.height || 'auto'
            
            if (!$tree || !$tree.length) return
            
            var treeid = $tree.attr('id')
            var $box   = $('#'+ treeid +'_select_box')
            var setPosition = function($box) {
                var top        = $this.offset().top,
                    left       = $this.offset().left,
                    $clone     = $tree.clone().appendTo($('body')),
                    treeHeight = $clone.outerHeight()
                
                $clone.remove()
                
                var offsetBot = $(window).height() - treeHeight - top - h,
                    maxHeight = $(window).height() - top - h
                
                if (options.height == 'auto' && offsetBot < 0) maxHeight = maxHeight + offsetBot
                $box.css({top:(top + h), left:left, 'max-height':maxHeight})
            }
            
            $this.click(function() {
                if ($box && $box.length) {
                    setPosition($box)
                    $box.show()
                    return
                }
                
                var zindex = 2
                var dialog = $.CurrentDialog
                
                if (dialog && dialog.length) {
                    zindex = dialog.css('zIndex') + 1
                }
                $box  = $('<div id="'+ treeid +'_select_box" class="tree-box"></div>')
                            .css({position:'absolute', 'zIndex':zindex, 'min-width':options.width, height:options.height, overflow:'auto', background:'#FAFAFA', border:'1px #EEE solid'})
                            .hide()
                            .appendTo($('body'))
                $tree.appendTo($box).css('width','100%').data('fromObj', $this).removeClass('hide').show()
                setPosition($box)
                $box.show()
            })
            
            $('body').on('mousedown', function(e) {
                var $target = $(e.target)
                
                if (!($this[0] == e.target || ($box && $box.length > 0 && $target.closest('.tree-box').length > 0))) {
                    $box.hide()
                }
            })
            
            var $scroll = $this.closest('[data-layout-h]')
            
            if ($scroll && $scroll.length) {
                $scroll.scroll(function() {
                    if ($box && $box.length) {
                        setPosition($box)
                    }
                })
            }
            
            //destory selectzTree
            $this.on('destory.bjui.selectztree', function() {
                $box.remove()
            })
        })
        
        /* accordion */
        $box.find('[data-toggle="accordion"]').each(function() {
            var $this = $(this)
            var initAccordion = function(hBox, height) {
                var offsety   = $this.data('offsety') || 0
                var height    = height || ($(hBox).height() - (offsety * 1))
                var $pheader  = $this.find('.panel-heading')
                var h1        = $pheader.outerHeight()
                
                $this.css('height', height)
                height = height - (h1 * $pheader.length) - (5 * ($pheader.length))
                $this.find('.panel-collapse').find('.panel-body').css('height', height)
            }
            var hBox   = $this.data('heightbox')
            var height = $this.data('height')
            
            if (hBox || height) {
                initAccordion(hBox, height)
                $(window).resize(function() {
                    initAccordion(hBox, height)
                })
            }
            
            $this.on('shown.bs.collapse', function() {
                var $collapse = $this.find('[data-toggle=collapse]')
                
                $collapse.find('i').removeClass('fa-caret-square-o-down').addClass('fa-caret-square-o-right')
                $collapse.removeClass('active').not('.collapsed').addClass('active').find('i').removeClass('fa-caret-square-o-right').addClass('fa-caret-square-o-down')
            })
        })
        
        /* Kindeditor */
        $box.find('[data-toggle="kindeditor"]').each(function() {
            var $editor         = $(this), options = $editor.data()
            
            if (options.items)                     options.items = options.items.split(',')
            if (options.afterUpload)         options.afterUpload = options.afterUpload.toFunc()
            if (options.afterSelectFile) options.afterSelectFile = options.afterSelectFile.toFunc()
            if (options.confirmSelect)     options.confirmSelect = options.confirmSelect.toFunc()
            
            var htmlTags = {
                font : [/*'color', 'size', 'face', '.background-color'*/],
                span : ['.color', '.background-color', '.font-size', '.font-family'
                        /*'.color', '.background-color', '.font-size', '.font-family', '.background',
                        '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.line-height'*/
                ],
                div : ['.margin', '.padding', '.text-align'
                        /*'align', '.border', '.margin', '.padding', '.text-align', '.color',
                        '.background-color', '.font-size', '.font-family', '.font-weight', '.background',
                        '.font-style', '.text-decoration', '.vertical-align', '.margin-left'*/
                ],
                table: ['align', 'width'
                        /*'border', 'cellspacing', 'cellpadding', 'width', 'height', 'align', 'bordercolor',
                        '.padding', '.margin', '.border', 'bgcolor', '.text-align', '.color', '.background-color',
                        '.font-size', '.font-family', '.font-weight', '.font-style', '.text-decoration', '.background',
                        '.width', '.height', '.border-collapse'*/
                ],
                'td,th': ['align', 'valign', 'width', 'height', 'colspan', 'rowspan'
                        /*'align', 'valign', 'width', 'height', 'colspan', 'rowspan', 'bgcolor',
                        '.text-align', '.color', '.background-color', '.font-size', '.font-family', '.font-weight',
                        '.font-style', '.text-decoration', '.vertical-align', '.background', '.border'*/
                ],
                a : ['href', 'target', 'name'],
                embed : ['src', 'width', 'height', 'type', 'loop', 'autostart', 'quality', '.width', '.height', 'align', 'allowscriptaccess'],
                img : ['src', 'width', 'height', 'border', 'alt', 'title', 'align', '.width', '.height', '.border'],
                'p,ol,ul,li,blockquote,h1,h2,h3,h4,h5,h6' : [
                    'class', 'align', '.text-align', '.color', /*'.background-color', '.font-size', '.font-family', '.background',*/
                    '.font-weight', '.font-style', '.text-decoration', '.vertical-align', '.text-indent', '.margin-left'
                ],
                pre : ['class'],
                hr : ['class', '.page-break-after'],
                'br,tbody,tr,strong,b,sub,sup,em,i,u,strike,s,del' : []
            }
            
            KindEditor.create($editor, {
                pasteType                : options.pasteType,
                minHeight                : options.minHeight || 260,
                autoHeightMode           : options.autoHeight || false,
                items                    : options.items || KindEditor.options.items,
                uploadJson               : options.uploadJson,
                fileManagerJson          : options.fileManagerJson,
                allowFileManager         : true,
                fillDescAfterUploadImage : true, //上传图片成功后转到属性页，为false则直接插入图片[设为true方便自定义函数(X_afterSelect)]
                afterUpload              : options.afterUpload,
                afterSelectFile          : options.afterSelectFile,
                X_afterSelect            : options.confirmSelect,
                htmlTags                 : htmlTags,
                cssPath                  : BJUI.JSPATH + 'plugins/kindeditor_4.1.10/editor-content.css',
                afterBlur                : function() { this.sync() }
            })
        })
        
        /* colorpicker */
        $box.find('[data-toggle="colorpicker"]').each(function() {
            var $this     = $(this)
            var isbgcolor = $this.data('bgcolor')
            
            $this.colorpicker()
            if (isbgcolor) {
                $this.on('changeColor', function(ev) {
                    $this.css('background-color', ev.color.toHex())
                })
            }
        })
        
        $box.find('[data-toggle="clearcolor"]').each(function() {
            var $this   = $(this)
            var $target = $this.data('target') ? $($this.data('target')) : null
            
            if ($target && $target.length) {
                $this.click(function() {
                    $target.val('')
                    if ($target.data('bgcolor')) $target.css('background-color', '')
                })
            }
        })
        
    })
    
}(jQuery);