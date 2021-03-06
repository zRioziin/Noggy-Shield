var GExceptionList = new Array;

function GetWebExceptions()
{
	// define constants
	// Note: if a file exists, using forWriting will set
	// the contents of the file to zero before writing to
	// it. 
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	// define array to store lines. 
	rline = new Array();
	
	// Create the object 
	fs = new ActiveXObject("Scripting.FileSystemObject");
	f = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Exceptions list.txt");
	
	// Open the file 
	is = f.OpenAsTextStream( forReading, 0 );
	
	// start and continue to read until we hit
	// the end of the file. 
	var count = 0;
	while( !is.AtEndOfStream ){
	   rline[count] = is.ReadLine();
	   count++;
	}

	// Close the stream 
	is.Close();

	// Place the contents of the array into 
	// a variable. 
	var List = "";
	for(i = 0; i < rline.length; i++){
	   List += rline[i];
	}
 
	//DO SOMETHING!!
	//IsAnException(List, Msg);
	
	var ListArray = List.split("|");
	
	GExceptionList = ListArray;
}

function IsInArray(Array, Str)
{
	var _Seen = false;
	for(var i=0; i<=Array.length; i++)
	{
		if(Str == Array[i])
		{
			_Seen = true;
			break;
		}
	}
	if(_Seen)
	{
		return true;
	}
	else
	{
		return false;
	}
}

function AddToList(URL)
{
	if(IsInArray(GExceptionList, URL))
	{
		Debug.Trace("ERROR. THE ELEMENT ALREADY EXISTS");
	}
	else
	{
		GExceptionList.push(URL);
	}
}

function RemoveFromList(URL)
{
	var _Seen = false;
	for(var i=0; i<=GExceptionList.length;)
	{
		if(URL == GExceptionList[i])
		{
			GExceptionList.splice(i, 1);
			_Seen = true;
			break;
		}
		else{i++}
	}
	if(!_Seen)
	{
		Debug.Trace("ERROR. THE ELEMENT DOESN'T EXIST");
	}
}

function WriteWebExceptions()
{
	NewExceptions = GExceptionList.toString();
	NewExceptions = NewExceptions.replace(/,/g, "|")
	
	// define constants
	// Note: if a file exists, using forWriting will set
	// the contents of the file to zero before writing to
	// it. 
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	// Create FileSystemObject 
	fs = new ActiveXObject( "Scripting.FileSystemObject" );
	
	// Create the text file 
	fs.CreateTextFile(MsgPlus.ScriptFilesPath + "\\" + "Exceptions list.txt");
	
	// Open the file for appending 
	os = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Exceptions list.txt");
	os = os.OpenAsTextStream( forAppending, 0 );
	
	// Write two lines of text to the file 
	os.write(NewExceptions);
	
	// Close the file 
	os.Close();
}