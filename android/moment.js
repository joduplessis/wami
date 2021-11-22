import moment from 'moment';

(function(moment) {

    moment.fn.fromNowShort = function() {

        var shortTimeStrings =  {
            s : "%ds",
            m : "%dm",
            h : "%dh",
            d : "%dd",
            y : "%dy"
        };


        var milliseconds = this.diff(moment()),

            seconds = Math.round(Math.abs(milliseconds) / 1000),
            minutes = Math.round(seconds / 60),
            hours = Math.round(minutes / 60),
            days = Math.round(hours / 24),
            years = Math.round(days / 365),

            args = seconds < 45 && ['s', seconds] ||
                minutes < 45 && ['m', minutes] ||
                hours < 22 && ['h', hours] ||
                days <= 300 && ['d', days] ||
                ['y', years];

        var rt = shortTimeStrings[args[0]];
        return rt.replace(/%d/i, args[1] || 1);
    }

}(moment));