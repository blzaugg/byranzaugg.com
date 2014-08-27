
window.addEvent('domready', function() {
    var zTables = new ZebraTables('zebra'); 
});



var ZebraTables = new Class({
	initialize: function(table_class) {
		//add table shading
		$$('table.' + table_class + ' tr').each(function(el,i) {
			//do regular shading
			var _class = i % 2 ? 'zt-even' : 'zt-odd'; el.addClass(_class);
			//do mouseover
			el.addEvent('mouseenter',function() { if(!el.hasClass('zt-highlight')) { el.addClass('zt-mo').removeClass(_class); } });
			//do mouseout
			el.addEvent('mouseleave',function() { if(!el.hasClass('zt-highlight')) { el.removeClass('zt-mo').addClass(_class); } });
			//do click
			el.addEvent('click',function() {
				//click off
				if(el.hasClass('zt-highlight'))
				{
					el.removeClass('zt-highlight').addClass(_class);
				}
				//clock on
				else
				{
					el.removeClass(_class).removeClass('zt-mo').addClass('zt-highlight');
				}
			});
			//highlight
			if(el.getProperty('alt') != null &&  el.getProperty('alt') == '')
			{
				el.removeClass(_class).addClass('zt-highlight');
			}
		});
	}
});
