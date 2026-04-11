Set shell = CreateObject("WScript.Shell")
Set fso = CreateObject("Scripting.FileSystemObject")
projectDir = CreateObject("Scripting.FileSystemObject").GetParentFolderName(WScript.ScriptFullName)
localNodePath = projectDir & "\.local-tools\node\node.exe"
electronExePath = projectDir & "\node_modules\electron\dist\electron.exe"
electronCliPath = projectDir & "\node_modules\electron\cli.js"
mainEntryPath = projectDir & "\electron\main.mjs"
logPath = projectDir & "\desktop-companion-vbs.log"

Sub WriteLog(message)
  Dim stream
  Set stream = fso.OpenTextFile(logPath, 8, True)
  stream.WriteLine Now & " - " & message
  stream.Close
End Sub

shell.CurrentDirectory = projectDir
WriteLog "Silent launcher requested"

If fso.FileExists(electronExePath) And fso.FileExists(mainEntryPath) Then
  WriteLog "Launching via direct electron.exe"
  shell.Run Chr(34) & electronExePath & Chr(34) & " " & Chr(34) & mainEntryPath & Chr(34), 0, False
ElseIf fso.FileExists(localNodePath) And fso.FileExists(electronCliPath) And fso.FileExists(mainEntryPath) Then
  WriteLog "Launching via local node.exe"
  shell.Run Chr(34) & localNodePath & Chr(34) & " " & Chr(34) & electronCliPath & Chr(34) & " " & Chr(34) & mainEntryPath & Chr(34), 0, False
Else
  WriteLog "Falling back to batch launcher"
  shell.Run Chr(34) & projectDir & "\start-desktop-companion.bat" & Chr(34), 0, False
End If
