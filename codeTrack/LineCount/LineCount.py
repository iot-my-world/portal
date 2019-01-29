import os, csv, datetime

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

def countLinesInFile(pathToFile):
    lineCount = 0
    # print("Count In:" + pathToFile)
    with open(pathToFile) as codeFile:
        for line in codeFile:
            if line.strip():
                lineCount +=1
    return lineCount

def validFileExt(file, fileExts):
    for ext in fileExts:
        if file.endswith(ext):
            return True
    return False

def countLinesInAll(dirToSearch, fileExts, dirsToIgnore):
    totalNoFiles = 0
    totalNoLines = 0

    itemsInDir = os.listdir(dirToSearch)
    for item in itemsInDir:
        pathToItem = os.path.join(dirToSearch, item)
        if os.path.isdir(pathToItem):
            if item in dirsToIgnore:
                continue
            moreFiles, moreLines = countLinesInAll(pathToItem, fileExts, dirsToIgnore)
            totalNoFiles += moreFiles
            totalNoLines += moreLines
        else:
            if validFileExt(item, fileExts):
                totalNoFiles += 1
                totalNoLines += countLinesInFile(pathToItem)
    return totalNoFiles, totalNoLines

if __name__ == "__main__":
    countTime = datetime.datetime.now()
    for count in lineCounts:
        print("____Counting for %s____" % (count))
        totalNoFiles, totalNoLines = countLinesInAll(
                                                    lineCounts[count]["dirToSearch"],
                                                    lineCounts[count]["fileExts"],
                                                    lineCounts[count]["dirsToIgnore"],
                                                    )
        print("Total No Files: %s" % (totalNoFiles))
        print("Total No Lines: %s" % (totalNoLines))

        header = ["dateTime", "totalFiles", "totalLines"]
        writeHeader = not os.path.isfile(lineCounts[count]["csvToSaveTo"])

        with open(lineCounts[count]["csvToSaveTo"], 'a') as csvfile:
            writer = csv.writer(
                                        csvfile,
                                        delimiter=';',
                                        quotechar='|',
                                        quoting=csv.QUOTE_MINIMAL
                                    )
            if writeHeader:
                writer.writerow(header)
            writer.writerow([datetime.datetime.now(), totalNoFiles, totalNoLines])
