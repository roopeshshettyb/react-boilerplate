import React, { useEffect, useRef } from "react";

export default function WordCloud({ words }) {
    const Wordcloud = require("wordcloud");

    var canvasRef = useRef(null);
    const file = {
        "style": {
            "fontFamily": "Gabarito",
            "backgroundColor": "White",
            "cloudTitle": "Most Common Roles",
            "cloudDescription": "",
            "titleColor": "black",
            "descriptionColor": "black",
            "captionSize": "30",
            "cloudWidth": "900",
            "cloudHeight": "500",
            "weightFactor": 0.8,
            "thumbnail": {
                "display": true,
                "height": 110,
                "width": 200
            },
            "popup": {
                "display": true,
                "displayWord": false,
                "displayCount": false,
                "backgroundColor": "white",
                "fontColor": "black",
                "linkColor": "black",
                "fontSize": "22px",
                "width": "250px",
                "minHeight": "100px",
                "widthOffset": 250
            },
            "highlight": {
                "display": true
            }
        },
        "words": words
    }
    const styles = file.style
    var data = file.words.sort((a, b) => { return a.weight - b.weight });

    const canvasHeight = styles.cloudHeight || 900;
    const canvasWidth = styles.cloudWidth || 500;   //edit canvasWidth to make the cloud bigger/smaller
    const count = data.length
    const displayHighlight = styles.highlight.display !== undefined ? styles.highlight.display : false


    var minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
    const max = Math.max(...data.map((w) => w.weight))
    data.forEach(ele => { ele.weight = normalise(ele.weight, max, minWeight) })
    const medianOne = median(data.slice(0, Math.floor((2 * count) / 3)));
    const medianTwo = median(data.slice(Math.floor(count / 3), count));
    minWeight = Math.min(...data.slice(0, count).map((w) => w.weight));
    data.sort((a, b) => { return b.weight - a.weight });

    function normalise(val, max, min) {
        let diff = max - min;
        if (diff === 0) diff = 1;
        return ((val - min) * 250 / (diff)) + (max * 1.1 / min);
    }

    // Overwrite Math.random to use seed to ensure same word cloud is printed on every render
    function randseed(s) {
        s = Math.sin(s) * 10000;
        return s - Math.floor(s);
    }

    let seed = 1;
    Math.random = function () {
        seed++;
        return randseed(seed);
    };

    function median(arr) {
        arr.sort((a, b) => a["weight"] - b["weight"]);
        let mid = arr.length >> 1;
        let res =
            arr.length % 2
                ? arr[mid].weight
                : (arr[mid - 1].weight + arr[mid].weight) / 2;
        return res;
    }

    function getColor(word, weight, maxWeight) {
        if (weight >= minWeight && weight < medianOne) {
            return "rgba(0,0,0,0.6)";
        } else if (weight < medianTwo && weight >= medianOne) {
            return "rgba(0,0,0,0.8)";
        } else if (weight <= maxWeight && weight >= medianTwo) {
            return "rgba(0,0,0,1.0)";
        }
        return 'rgba(0,0,0,0.6)'
    }

    function getSize(size, item, final_data, maxWeight) {
        let biggest = final_data[0][0].length;
        let max = maxWeight;
        let factor = styles.weightFactor || 1
        if (biggest <= 7) {
            if (size === max) {
                return factor / 1.31 * (Math.pow(size, 1) * (3 * (canvasWidth - 300) / 2)) / 1024;
            }
            return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 7 && biggest <= 10) {
            if (size === max) {
                return factor / 1.3 * (Math.pow(size, 0.95) * (3 * (canvasWidth - 200) / 2)) / 1024;
            }
            return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 10 && biggest <= 13) {
            if (size === max) {
                return factor / 1.3 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 200) / 2)) / 1024;
            }
            return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
        } else if (biggest > 13) {
            if (size === max) {
                return factor / 1.3 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 200) / 2)) / 1024;
            }
            return factor / 1.2 * (Math.pow(size, 0.90) * (3 * (canvasWidth - 300) / 2)) / 1024;
        }
    }

    function generateCloud() {
        if (displayHighlight) {
            var el = document.getElementById('wordHighlight');
            el.setAttribute('hidden', true);
        }
        let final_data = [];
        data.forEach((w) => {
            final_data.push([w.word, w.weight, w.click, w.color, w.weight]);
        });
        // setMaxWeight(Math.max(...data.map((w) => w.weight)));
        const maxWeight = Math.max(...data.map((w) => w.weight))
        var listColorCounter = 0;
        Wordcloud(canvasRef.current, {
            list: final_data,
            shape: "circle",
            minRotation: -1.57,
            maxRotation: 1.57,
            shuffle: false,
            fontFamily: styles.fontFamily || "Raleway",
            backgroundColor: styles.backgroundColor || "White",
            color: (word, weight) => {
                if (final_data[listColorCounter][3] !== undefined) { return final_data[listColorCounter++][3]; } else { return getColor(word, weight, maxWeight) }
            },
            rotationSteps: 2,
            rotateRatio: 0.4,
            // weightFactor: (size, item) => { if (size === 250) return Math.pow(size, 1.5); return Math.pow(size, 0.9) },
            weightFactor: (size, item) => getSize(size, item, final_data, maxWeight),
            shrinkToFit: true,
            minSize: 5,
            drawOutOfBound: false
        });
    }

    useEffect(() => {
        generateCloud()
    }, []);// eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div>
            {(styles.cloudTitle || styles.cloudDescription) && (
                <div>
                    <h1 style={{ fontFamily: styles.fontFamily || "Raleway", color: styles.titleColor || "blue", display: 'flex', justifyContent: 'center', fontSize: '30pt' }}>
                        {styles.cloudTitle}
                    </h1>
                    <h3 style={{ fontFamily: styles.fontFamily || "Raleway", color: styles.descriptionColor || "black", display: 'flex', justifyContent: 'center' }}>
                        {styles.cloudDescription}
                    </h3>
                </div>
            )}
            <div style={{ display: 'flex', justifyContent: 'center' }}
            >
                <canvas style={{ cursor: "pointer" }} ref={canvasRef} width={canvasWidth} height={canvasHeight} />
                {displayHighlight && <div id='wordHighlight'></div>}
            </div>
        </div>
    );
}