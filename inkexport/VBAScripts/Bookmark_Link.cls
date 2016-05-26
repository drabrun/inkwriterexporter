VERSION 1.0 CLASS
BEGIN
  MultiUse = -1  'True
END
Attribute VB_Name = "ThisDocument"
Attribute VB_GlobalNameSpace = False
Attribute VB_Creatable = False
Attribute VB_PredeclaredId = True
Attribute VB_Exposed = True
Sub ReplaceWithBookmarks()
    Dim rng As Range
 
    Set rng = ActiveDocument.Range
    With rng.Find
        .MatchWildcards = True
        .Forward = True
        .Wrap = wdFindContinue
        .Text = "\{\{\{*\}\}\}"
        Do While .Execute
            Dim hand As String: hand = Replace(rng.Text, "{", "")
            hand = Replace(hand, "}", "")
            rng.Text = hand  ''clear the "XXX" (optional)
             
            ActiveDocument.Bookmarks.Add hand, rng
        Loop
    End With
    
    rng = ActiveDocument.Range
    With rng.Find
        .MatchWildcards = True
        .Forward = True
        .Wrap = wdFindContinue
        .Text = "\<\<\<*\>\>\>"
        Do While .Execute
            Dim hand2 As String: hand2 = Replace(rng.Text, "<", "")
            hand2 = Replace(hand2, ">", "")
            rng.Text = hand2 ''clear the "XXX" (optional)
            
            ActiveDocument.Hyperlinks.Add Anchor:=rng, _
            SubAddress:=hand2
 
 
            ActiveDocument.Bookmarks.Add hand, rng
        Loop
    End With
End Sub






