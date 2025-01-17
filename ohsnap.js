/*
 * ###################################################################################
 *  File: ohsnap.js
 *  File Created: Thursday, 3rd August 2023 5:36:14 pm
 *  Author: Sergey Ko
 *  Last Modified: Friday, 1st September 2023 10:25:14 pm
 *  Modified By: Sergey Ko
 *  License: MIT License (MIT)
 *  Original author: Justin Domingue
 * ###################################################################################
 *  CHANGELOG:
 * - 2023/01/04 - added title, optimized for tailwind
 * - 2023/03/08 - optimization + new features
 * - 2023/09/02 - test for fadeIn/Out
 * ###################################################################################
 */

/**
 * Shows a toast on the page
 *
 * @param string text to show
 * @param object {
 *      title: alert title. Default: undefined
 *      color: alert will have class 'ohsnap-color'. Default: 'success'
 *      styles: object ex.: {'bg': 'bg-color dark:bg-color','border': 'border-color dark:border-color', 'icon': 'bg-color dark:bg-color'}
 *                where border is optional. Default: undefined
 *      icon: FontAwesome icon name that contains icon background image. Default: undefined (no icon is shown)
 *      duration: how long alert would be displayed in ms. Default: 7000ms
 *      container: wrapper element for all the alerts. Example: #some-class, .a-class, etc. Default: body
 *      fadein: duration of the fadeIn. It has no effect if the core lib has no fadeIn method. Default: 'fast'
 *      fadeout: duration of the fadeOut. It has no effect if the core lib has no fadeOut method. Default: 'fast'
 *      top: initial vertical offset in pixels
 *      right: initial horizontal offset in pixels
 *      type: how to display the sequence of onSnaps (linear | isostack | vstack)
 * }
*
*/
export function ohSnap(text, options) {
    var defaultOptions = {
        'title': undefined,
        'color': undefined,
        'styles': undefined,  // {'bg': 'bg-color dark:bg-color','border': 'border-color dark:border-color', 'icon': 'bg-color dark:bg-color'}
        'icon': undefined,
        'duration': 7000,
        'container': 'body',
        'fadein': 'fast',
        'fadeout': 'fast',
        'top': 36,
        'right': 36,
        'type': 'isostack'       // linear | isostack | vstack
    }
    options === undefined && console.warn('ohSnap options is undefined');
    options = (typeof options == 'object') ? $.extend(defaultOptions, options) : defaultOptions;

    var $container = $(options['container']),
        color_markup = "",
        icon_markup = "",
        title = "";

    if(options.styles === undefined) {
        color_markup = 'ohsnap-' + options.color;
    } else {
        color_markup = options.styles.bg;
        if(options.styles.border !== undefined)
            color_markup += ' border ' + options.styles.border;
    }

    if (options.title !== undefined) {
        title = '<h4 class="title">' + options.title + '</h4>';
    }

    if(options.icon !== undefined) {
        icon_markup = '<i class="fas fa-"'+options.icon + '"></i>';
    }

    // how many are already displayed
    $('.ohsnap-wrapper').each((i, e) => {
        let t = 1.1, r = 0;
        if(options.type === 'isostack') {
            t = 0.1;
            r = 0.03;
        } else if(options.type === 'vstack')
            t = 0.2;
        options.top += Math.round($(e).height() * t);
        options.right += Math.round($(e).width() * r);
    });

    // Generate the HTML
    const el = $('<div>', { 'class': 'ohsnap-wrapper', 'style': 'top:' + options.top + 'px;right:' + options.right +'px' });
    const d0 = $('<div>', {'class': 'ohsnap-container ' + color_markup});
    const d1 = $('<div>', {'class': 'content'});
    d1.html(title + '<p>' + text + '</p>');
    d0.append(d1);
    if(options.icon !== void 0 || (options.styles !== void 0 && options.styles.icon !== void 0)) {
        const d2 = $('<div>', {'class': 'icon-wrapper ' + (options.styles !== undefined && options.styles.icon !== undefined
                    ? options.styles.icon : '')});
        if(icon_markup !== "")
            d2.html(icon_markup);
        else
            d2.addClass(options.icon);
        d0.append(d2);
    }
    el.append(d0).hide();

    // Append the label to the container
    $container.append(el);
    if(typeof el.fadeIn !== 'undefined')
        el.fadeIn(options['fadein']);
    else
        el.show();

    // Remove the notification on click
    el.on('click', function (e) {
        ohSnapX($(this));
    });

    // After 'duration' seconds, the animation fades out
    if (options.duration != 0) {
        setTimeout(function () {
            ohSnapX(el);
        }, options.duration);
    } else {
        $('.ohsnap-wrapper').on('click', (e) => {
            ohSnapX(el);
        });
    }
}

/**
* Removes a toast from the page
* Called without arguments, the function removes all alerts
*
* @param string element - a jQuery object to remove
* @param {
*      duration: duration of the alert fade out - 'fast', 'slow' or time in ms. Default 'fast'
* } options
*/
export function ohSnapX(element, options) {
    var defaultOptions = {
        'fadeout': 'fast'
    };

    options = (typeof options === 'object') ? $.extend(defaultOptions, options) : defaultOptions;

    let el = (typeof element !== 'undefined') ? element : $('.ohsnap-wrapper');

    if(typeof el.fadeOut !== 'undefined') {
        el.fadeOut(options['fadeout'], function () {
            $(this).remove();
        });
    } else {
        el.hide();
    }
}