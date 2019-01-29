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

            graphTraces.append(go.Scatter(
                        x=dates,
                        y=totalLines,
                        name=lineCount,
                    ))

    fig = tools.make_subplots(
                            rows=int(len(graphTraces)/2) + 1,
                            cols=2
                            )
    row = 0
    col = 1
    for i, trace in enumerate(graphTraces):
        if ((i + 1) % 2):
            row += 1
            col = 1
        else:
            col += 1
        fig.append_trace(trace, row, col)
    plotly.offline.plot(
                        fig,
                        filename = "/Users/bernardbussy/projects/bitbucket.org/reacttimekeeper/codeTrack/LineCount/graph.html",
                        auto_open = True,
                        )
