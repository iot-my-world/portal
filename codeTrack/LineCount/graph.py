import os, csv
from datetime import datetime
import plotly
import plotly.graph_objs as go
from plotly import tools

lineCounts = {
    "portal": {
        "dirToSearch": "/Users/bernardbussy/projects/gitlab/iotTracker/portal",
        "csvToSaveTo": "/Users/bernardbussy/projects/gitlab/iotTracker/portal/codeTrack/LineCount/csv/portal.csv",
        "dirsToIgnore": ["node_modules", "codeTrack"],
        "fileExts": [".js", ".jsx", ".css"],
    },
    "brain": {
        "dirToSearch": "/Users/bernardbussy/go/src/gitlab.com/iotTracker/brain",
        "csvToSaveTo": "/Users/bernardbussy/projects/gitlab/iotTracker/portal/codeTrack/LineCount/csv/brain.csv",
        "dirsToIgnore": [],
        "fileExts": [".go"],
    },
    "chamber": {
        "dirToSearch": "/Users/bernardbussy/projects/gitlab/iotTracker/chamber",
        "csvToSaveTo": "/Users/bernardbussy/projects/gitlab/iotTracker/portal/codeTrack/LineCount/csv/chamber.csv",
        "dirsToIgnore": ["node_modules"],
        "fileExts": [".js"],
    },
    "nerve": {
        "dirToSearch": "/Users/bernardbussy/go/src/gitlab.com/iotTracker/nerve",
        "csvToSaveTo": "/Users/bernardbussy/projects/gitlab/iotTracker/portal/codeTrack/LineCount/csv/nerve.csv",
        "dirsToIgnore": [],
        "fileExts": [".go"],
    },
}

if __name__ == "__main__":
    print("Starting plot!")
    graphTraces = []
    for lineCount in lineCounts:
            dates = []
            totalFiles = []
            totalLines = []
            with open(lineCounts[lineCount]["csvToSaveTo"]) as csvfile:
                reader = csv.DictReader(
                                        csvfile,
                                        delimiter=';',
                                        quotechar='|',
                                        quoting=csv.QUOTE_MINIMAL
                                        )
                for row in reader:
                    dates.append(datetime.strptime(row["dateTime"], "%Y-%m-%d %H:%M:%S.%f"))
                    totalFiles.append(int(row["totalFiles"]))
                    totalLines.append(int(row["totalLines"]))

            graphTraces.append({
                        "x":dates,
                        "y":totalLines,
                        "name":lineCount.capitalize(),
                        "type":"scatter",
                    })

    fig = tools.make_subplots(
                            rows=1,
                            cols=1,
                            shared_xaxes=True,
                            shared_yaxes=True,
                            )
    for trace in graphTraces:
        fig.append_trace(trace, 1, 1)

    fig["layout"].update({"title":"iotTracker Codebase Tracking"})
    fig["layout"].update({
                            "xaxis":{
                                "title": "Time",
                            },
                            "yaxis":{
                                "title": "Line Count",
                            },
                        })
    fig["layout"].update({"title":"iotTracker Codebase Tracking"})
    plotly.offline.plot(
                        fig,
                        filename = "/Users/bernardbussy/projects/gitlab/iotTracker/portal/codeTrack/LineCount/graph.html",
                        auto_open = True,
                        )
