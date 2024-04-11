export default function ScaleCalculator ( lowerBound, upperBound ) {
    var maxTicks = 5;
    var tickSpacing;
    var range;
    var computedLowerBound;
    var computedUpperBound;

    calculate();

    this.getComputedLowerBound = function () {
        return computedLowerBound
    }

    this.getComputedUpperBound = function () {
        return computedUpperBound
    }

    this.getTickSpacing = function() {
        return tickSpacing;
    }

    function setMinMaxPoints (min, max) {
        lowerBound = min;
        upperBound = max;
        calculate();
    }

    function calculate () {
        range = computeScale(upperBound - lowerBound, false);
        tickSpacing = computeScale(range / (maxTicks - 1), true);
        computedLowerBound = (Math.floor(lowerBound / tickSpacing) * tickSpacing) - 5;
        console.log('lowerbound');
        console.log(computedLowerBound);
        computedUpperBound = Math.ceil(upperBound / tickSpacing) * tickSpacing;
    }

    function computeScale (range, round) {
        var exponent = Math.floor(Math.log10(range));
        var fraction = range / Math.pow(10, exponent);
        var niceFraction;
    
        if (round) {
          if (fraction < 1.5) niceFraction = 1;
          else if (fraction < 3) niceFraction = 2;
          else if (fraction < 7) niceFraction = 5;
          else niceFraction = 10;
        } else {
          if (fraction <= 1) niceFraction = 1;
          else if (fraction <= 2) niceFraction = 2;
          else if (fraction <= 5) niceFraction = 5;
          else niceFraction = 10;
        }
    
        return niceFraction * Math.pow(10, exponent);
      }


}