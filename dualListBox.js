/*
*       Developed by Justin Mead
*       ©2011 MeadMiracle
*		www.meadmiracle.com / meadmiracle@gmail.com
*       Version 1.3
*       Testing: IE8/Windows XP
*                Firefox/Windows XP
*                Chrome/Windows XP
*       Licensed under the Creative Commons GPL http://creativecommons.org/licenses/GPL/2.0/
*
*       OPTIONS LISTING:
*           *transferMode               - the type of transfer to perform on items (see heading TRANSFER MODES)
*           *sortBy                     - the attribute to use when sorting items (values: 'text' or 'value')
*           *useFilters                 - allow the filtering of items in either box (true/false)
*           *useCounters                - use the visible/total counters (true/false)
*           *useSorting                 - sort items after executing a transfer (true/false)
*           *selectOnSubmit             - select items in box 2 when the form is submitted (true/false)
*
*       All options have default values, and as such, are optional.  Check the 'settings' JSON object below to see the defaults.
*
*       TRANSFER MODES:
*           * 'move' - In this mode, items will be removed from the box in which they currently reside and moved to the other box. This is the default.
*           * 'copy' - In this mode, items in box 1 will ALWAYS remain in box 1 (unless they are hidden by filtering).  When they are selected for transfer
*                      they will be copied to box 2 and will be given the class 'copiedOption' in box 1 (my default styling for this class is yellow background
*                      but you may choose whatever styling suits you).  If they are then transferred from box 2, they disappear from box 2, and the 'copiedOption'
*                      class is removed from the corresponding option in box 1.
*
*/
(function($) {
    var settings = new Array();
    var group1 = new Array();
    var group2 = new Array();
    var onSort = new Array();
    //the main method that the end user will execute to setup the DLB
		$.fn.configureBoxes= function (options) {
    options = options || {};
    return this.each(function () {
    		var _this = this;
        //define default settings
        var index = settings.push({
            transferMode: 'move',
            sortBy: 'text',
            useFilters: true,
            useCounters: true,
            useSorting: true,
            selectOnSubmit: true
        });
        index--;
        //merge default settings w/ user defined settings (with user-defined settings overriding defaults)
        $.extend(settings[index], options);
        //define box groups
        group1.push({
            view: $('.box1View', _this),
            storage: $('.box1Storage', _this),
            filter: $('.box1Filter', _this),
            clear: $('.box1Clear', _this),
            counter: $('.box1Counter', _this),
            index: index
        });
        group2.push({
            view: $('.box2View', _this),
            storage: $('.box2Storage', _this),
            filter: $('.box2Filter', _this),
            clear: $('.box2Clear', _this),
            counter: $('.box2Counter', _this),
            index: index
        });
        //define sort function
        if (settings[index].sortBy == 'text') {
            onSort.push(function(a, b) {
                var aVal = a.text.toLowerCase();
                var bVal = b.text.toLowerCase();
                if (aVal < bVal) { return -1; }
                if (aVal > bVal) { return 1; }
                return 0;
            });
        } else {
            onSort.push(function(a, b) {
                var aVal = a.value.toLowerCase();
                var bVal = b.value.toLowerCase();
                if (aVal < bVal) { return -1; }
                if (aVal > bVal) { return 1; }
                return 0;
            });
        }
        //configure events
        if (settings[index].useFilters) {
            group1[index].filter.keyup(function() {
                Filter(group1[index]);
            });
            group2[index].filter.keyup(function() {
                Filter(group2[index]);
            });
            group1[index].clear.click(function() {
                ClearFilter(group1[index]);
            });
            group2[index].clear.click(function() {
                ClearFilter(group2[index]);
            });
        }
        if (IsMoveMode(settings[index])) {
            group2[index].view.dblclick(function() {
                MoveSelected(group2[index], group1[index]);
            });
            $(".to1", _this).click(function() {
                MoveSelected(group2[index], group1[index]);
            });
            $(".allTo1", _this).click(function() {
                MoveAll(group2[index], group1[index]);
            });
        } else {
            group2[index].view.dblclick(function() {
                RemoveSelected(group2[index], group1[index]);
            });
            $(".to1", _this).click(function() {
                RemoveSelected(group2[index], group1[index]);
            });
            $(".allTo1", _this).click(function() {
                RemoveAll(group2[index], group1[index]);
            });
        }
        group1[index].view.dblclick(function() {
            MoveSelected(group1[index], group2[index]);
        });
        $(".to2", _this).click(function() {
            MoveSelected(group1[index], group2[index]);
        });
        $(".allTo2", _this).click(function() {
            MoveAll(group1[index], group2[index]);
        });
        //initialize the counters
        if (settings[index].useCounters) {
            UpdateLabel(group1[index]);
            UpdateLabel(group2[index]);
        }
        //pre-sort item sets
        if (settings[index].useSorting) {
            SortOptions(group1[index]);
            SortOptions(group2[index]);
        }
        //hide the storage boxes
        group1[index].storage.css('display', 'none');
        group2[index].storage.css('display', 'none');
        //attach onSubmit functionality if desired
        if (settings[index].selectOnSubmit) {
        		group2[index].view.closest('form').submit(function() {
                group2[index].view.children('option').attr('selected', 'selected');
            });
        }

    });
	  }

    function UpdateLabel(group) {
        var showingCount = group.view.children("option").size();
        var hiddenCount = group.storage.children("option").size();
        group.counter.text('Showing ' + showingCount + ' of ' + (showingCount + hiddenCount));
    }
    function Filter(group) {
        var index = group.index;
        var filterLower;
        if (settings[index].useFilters) {
            filterLower = group.filter.val().toString().toLowerCase();
        } else {
            filterLower = '';
        }
        group.view.children('option').filter(function(i) {
            var toMatch = $(this).text().toString().toLowerCase();
            return toMatch.indexOf(filterLower) == -1;
        }).appendTo(group.storage);
        group.storage.children('option').filter(function(i) {
            var toMatch = $(this).text().toString().toLowerCase();
            return toMatch.indexOf(filterLower) != -1;
        }).appendTo(group.view);
        try {
            group.view.children('option').removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        if (settings[index].useSorting) { SortOptions(group); }
        if (settings[index].useCounters) { UpdateLabel(group); }
    }
    function SortOptions(group) {
        var $toSortOptions = group.view.children('option');
        $toSortOptions.sort(onSort[group.index]);
        group.view.empty().append($toSortOptions);
    }
    function MoveSelected(fromGroup, toGroup) {
        if (IsMoveMode(settings[fromGroup.index])) {
            fromGroup.view.children('option:selected').appendTo(toGroup.view);
        } else {
            fromGroup.view.children('option:selected:not([class*=copiedOption])').clone().appendTo(toGroup.view).end().end().addClass('copiedOption');
        }
        try {
            fromGroup.view.children('option').removeAttr('selected');
            toGroup.view.children('option').removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        Filter(toGroup);
        if (settings[fromGroup.index].useCounters) { UpdateLabel(fromGroup); }
    }
    function MoveAll(fromGroup, toGroup) {
        if (IsMoveMode(settings[fromGroup.index])) {
            fromGroup.view.children('option').appendTo(toGroup.view);
        } else {
            fromGroup.view.children('option:not([class*=copiedOption])').clone().appendTo(toGroup.view).end().end().addClass('copiedOption');
        }
        try {
            fromGroup.view.children('option').removeAttr('selected');
            toGroup.view.children('option').removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        Filter(toGroup);
        if (settings[fromGroup.index].useCounters) { UpdateLabel(fromGroup); }
    }
    function RemoveSelected(removeGroup, otherGroup) {
        otherGroup.view.children('option.copiedOption').add(otherGroup.storage).children('option.copiedOption').remove();
        try {
            removeGroup.view.children('option:selected').appendTo(otherGroup.view).removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        removeGroup.view.children('option').add(removeGroup.storage).children('option').clone().addClass('copiedOption').appendTo(otherGroup.view);
        Filter(otherGroup);
        if (settings[removeGroup.index].useCounters) { UpdateLabel(removeGroup); }
    }
    function RemoveAll(removeGroup, otherGroup) {
        otherGroup.view.children('option.copiedOption').add(otherGroup.storage + ' option.copiedOption').remove();
        try {
            removeGroup.storage.children('option').clone().addClass('copiedOption').add(removeGroup.view).children('option').appendTo(otherGroup.view).removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        Filter(otherGroup);
        if (settings[removeGroup.index].useCounters) { UpdateLabel(removeGroup); }
    }
    function ClearFilter(group) {
        group.filter.val('');
        group.storage.children('option').appendTo(group.view);
        try {
            group.view.children('option').removeAttr('selected');
        }
        catch (ex) {
            //swallow the error for IE6
        }
        if (settings[group.index].useSorting) { SortOptions(group); }
        if (settings[group.index].useCounters) { UpdateLabel(group); }
    }
    function IsMoveMode(currSettings) {
        return currSettings.transferMode == 'move';
    }
})(jQuery);