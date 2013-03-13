;(function($) {
    var createTestCanvas = function(font_size) {
        var w = (font_size * 0.8) | 0,
            h = font_size + 6;

        var $canvas = $("<canvas width='" + w + "' height='" + h + "'>&nbsp;</canvas>"),
            canvas_css = {
                position: 'absolute',
                left: '-9000px'
            };

        $canvas.attr('id', 'testCanvas').css(canvas_css);
        $('body').append($canvas);
        
        return document.getElementById('testCanvas');
    };

    var findCapHeight = function(canvas, family, options) {
        var ctx = canvas.getContext('2d'),
            cw = canvas.width,
            ch = canvas.height,
            baseline = ch - 5,
            font = options.font_size + "px '" + family + "'",
            glyph_top = 0;

        ctx.font = font;
        ctx.fillText('E', 2, baseline);

        var img = ctx.getImageData(0, 0, cw, ch),
            line_len = img.width * 4;

        for (var y = 0; y < img.data.length; y += line_len){
            var line = img.data.subarray(y, y + line_len),
                len = line.length,
                matches = 0;

            for (var x = 3; x < len; x += 4) {
                if (line[x] > options.alpha_threshold) {
                    matches++;
                }
            }

            if (matches > options.match_threshold) {
                glyph_top = y / line_len;
                break;
            }
        }

        return baseline - glyph_top;
    };

    $.fn.CapHeight = function(options) {
        options = $.extend({}, $.fn.CapHeight.defaults, options);
        var canvas = createTestCanvas(options.font_size),
            ctx = canvas.getContext('2d');
        this.each(function() {
            var $this = $(this);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            var glyph_height = findCapHeight(canvas, 
                                             $this.css('font-family'),
                                             options);
            var line_height = glyph_height / options.font_size;
            $this.css('line-height', line_height);
        });
    };

    $.fn.CapHeight.defaults = {
        font_size: 48,
        match_threshold: 8,
        alpha_threshold: 245
    };

})(jQuery);
