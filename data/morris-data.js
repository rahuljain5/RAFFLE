
function Area(){
    Morris.Area({
        element: 'morris-area-chart',
        data: [{
            period: '2010 Q1',
            iphone: 2666,
            ipad: null,
            itouch: 2647
        }, {
            period: '2010 Q2',
            iphone: 2778,
            ipad: 2294,
            itouch: 2441
        }, {
            period: '2010 Q3',
            iphone: 4912,
            ipad: 1969,
            itouch: 2501
        }, {
            period: '2010 Q4',
            iphone: 3767,
            ipad: 3597,
            itouch: 5689
        }, {
            period: '2011 Q1',
            iphone: 6810,
            ipad: 1914,
            itouch: 2293
        }, {
            period: '2011 Q2',
            iphone: 5670,
            ipad: 4293,
            itouch: 1881
        }, {
            period: '2011 Q3',
            iphone: 4820,
            ipad: 3795,
            itouch: 1588
        }, {
            period: '2011 Q4',
            iphone: 15073,
            ipad: 5967,
            itouch: 5175
        }, {
            period: '2012 Q1',
            iphone: 10687,
            ipad: 4460,
            itouch: 2028
        }, {
            period: '2012 Q2',
            iphone: 8432,
            ipad: 5713,
            itouch: 1791
        }],
        xkey: 'period',
        ykeys: ['iphone', 'ipad', 'itouch'],
        labels: ['iPhone', 'iPad', 'iPod Touch'],
        pointSize: 2,
        hideHover: 'auto',
        resize: true
    });
}
function donut(elementid, Values, totalstuds){
    Morris.Donut({
        element: elementid,
        data: [{
            label: `Passed\n(${(Values["Passed"]/(totalstuds/100)).toFixed(2)}%)`,
            value: Values["Passed"]
        }, {
            label: `Failed\n(${(Values["Failed"]/(totalstuds/100)).toFixed(2)}%)`,
            value: Values["Failed"]
        }, {
            label: `Absent\n(${(Values["Absent"]/(totalstuds/100)).toFixed(2)}%)`,
            value: Values["Absent"]
        }],
        colors: [
            '#089C00', '#D21A01', '#5B5C5B'
            ],
        resize: true
    });
}
    
function Bar(elementid, stats, colorStatus) {
    Morris.Bar({
        element: elementid,
        data: stats,
        xkey: 'y',
        ykeys: 'a',
        labels: 'Series A',
        barColors: colorStatus,
        gridTextColor: '#272C1E',
        hideHover: 'auto',
        resize: true
    });
}