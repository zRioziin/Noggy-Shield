//Settings vars
var CurrSettings = new Array;
var UseURLVoid = new Boolean;
var ShowScanFor = new Number;
var Enabled = new Boolean;
//Windows vars
var ManScanWnd;
var AddExWnd;
var DelExWnd;
var ConfigWnd;
var AboutWnd;
var ScanWnd;

//Settings-related functions
function GetSettings()
{
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	rline = new Array();
	
	fs = new ActiveXObject("Scripting.FileSystemObject");
	f = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Settings.txt");
	
	is = f.OpenAsTextStream( forReading, 0 );
	
	var count = 0;
	while( !is.AtEndOfStream ){
	   rline[count] = is.ReadLine();
	   count++;
	}

	is.Close();

	var List = "";
	for(i = 0; i < rline.length; i++){
	   List += rline[i];
	}
	
	CurrSettings = List.split("|");
	
	UseURLVoid = CurrSettings[0];
	ShowScanFor = CurrSettings[1];
	Enabled = CurrSettings[2];
}

function SaveSettings()
{
	var NewSettings = CurrSettings.toString();
	NewSettings = NewSettings.replace(/,/g, "|");
	 
	var forReading = 1, forWriting = 2, forAppending = 8;
	
	fs = new ActiveXObject( "Scripting.FileSystemObject" );
	
	fs.CreateTextFile(MsgPlus.ScriptFilesPath + "\\" + "Settings.txt");
	
	os = fs.GetFile(MsgPlus.ScriptFilesPath + "\\" + "Settings.txt");
	os = os.OpenAsTextStream( forAppending, 0 );
	
	os.write(NewSettings);
	
	os.Close();
}

//UI-related functions
function OnEvent_MenuClicked(MenuItemId, Location, OriginWnd)
{
	switch(MenuItemId)
	{
		case "ManScan":
			ManScanWnd = MsgPlus.CreateWnd("GUI.xml", "ManScan");
			Debug.Trace("ManScan");
			break;
		case "AddEx":
			AddExWnd = MsgPlus.CreateWnd("GUI.xml", "AddEx");
			Debug.Trace("AddEx");
			break;
		case	"DelEx":
			DelExWnd = MsgPlus.CreateWnd("GUI.xml", "DelEx");
			
			for(var i=0; i<GExceptionList.length; i++)
			{
				DelExWnd.Combo_AddItem("ComboBox", GExceptionList[i]);
			}
			
			DelExWnd.Combo_SetCurSel("ComboBox", 0);
			Debug.Trace("DelEx");
			break;
		case "Config":
			ConfigWnd = MsgPlus.CreateWnd("GUI.xml", "Config")
			GetSettings();
			
			switch(UseURLVoid)
			{
				case "true":
					Debug.Trace("URLVoid");
					ConfigWnd.Button_SetCheckState("URLVoidRadio", true);
					break;
				
				case "false":
					Debug.Trace("Sucuri");
					ConfigWnd.Button_SetCheckState("SucuriRadio", true);
					break;
			}
	
			ConfigWnd.SetControlText("TimerTextBox", ShowScanFor);
			
			switch(Enabled)
			{
				case "true":
					ConfigWnd.Button_SetCheckState("EnabledCheck", true);
					break;
					
				case "false":
					ConfigWnd.Button_SetCheckState("EnabledCheck", false);
					break;
			}
			
			Debug.Trace("Config")
			break;
		case "About":
			AboutWnd = MsgPlus.CreateWnd("GUI.xml", "About");
			Debug.Trace("About");
			break;
	}
}

//																		<WindowControls>
function OnScanWindowEvent_CtrlClicked(ScanWnd, ControlId)
{
	switch(ControlId)
	{
		case "OpenWebBtn":
			Debug.Trace("OpenWebBtn");
			OpenInBrowser(NowScanning);
			ScanWnd.Close(1);
			break;
		case "CloseNowBtn":
			Debug.Trace("CloseNowBtn");
			ScanWnd.Close(1);
			break;
	}
}
function OnManScanEvent_CtrlClicked(ManScanWnd, ControlId)
{
	if(ControlId=="GoBtn")
	{
		Debug.Trace("GoBtn");
		ScanLink(ManScanWnd.GetControlText("TextBox"), ManScanWnd.Button_IsChecked("URLVoidRadio"), false);
		ManScanWnd.Close(1);
	}
}
function OnAddExEvent_CtrlClicked(AddExWnd, ControlId)
{
	switch(ControlId)
	{
		case "OkBtn":
			Debug.Trace("OkBtn");
			AddToList(AddExWnd.GetControlText("TextBox"));
			Debug.Trace("New GEL: "+GExceptionList);
			AddExWnd.Close(1);
			break;
		case "CancelBtn":
			Debug.Trace("CancelBtn");
			AddExWnd.Close(1);
			break;
	}
}
function OnDelExEvent_CtrlClicked(DelExWnd, ControlId)
{
	switch(ControlId)
	{
		case "OkBtn":
			Debug.Trace("DeleteBtn");
			RemoveFromList(GExceptionList[DelExWnd.Combo_GetCurSel("ComboBox")]);
			Debug.Trace("New GEL: "+GExceptionList);
			DelExWnd.Close(1);
			break;
		case "CancelBtn":
			Debug.Trace("CancelBtn");
			DelExWnd.Close(1);
			break;
	}
}
function OnConfigEvent_CtrlClicked(ConfigWnd, ControlId)
{
	switch(ControlId)
	{
		case "SaveBtn":
			Debug.Trace("SaveBtn");
			CurrSettings=[ConfigWnd.Button_IsChecked("URLVoidRadio"),ConfigWnd.GetControlText("TimerTextBox"),ConfigWnd.Button_IsChecked("EnabledCheck")];
			if(CurrSettings[1]<5)
			{
				CurrSettings[1]=5;
			}
			else if(CurrSettings[1]>20)
			{
				CurrSettings[1]=20;
			}
			SaveSettings();
			GetSettings();
			Debug.Trace("CurrSettings: "+CurrSettings);
			ConfigWnd.Close(1);
			break;
		case "CancelBtn":
			ConfigWnd.Close(1);
			break;
	}
}
function OnAboutEvent_CtrlClicked(AboutWnd, ControlId)
{
	switch(ControlId)
	{
		case "MaigolLinkMG":
			OpenInBrowser("http://wink.messengergeek.com/u/Maigol");
			break;
			
		case "MaigolLinkGH":
			OpenInBrowser("http://maigol.xyz");
			break;
			
		case "MaigolLinkYT":
			OpenInBrowser("http://www.youtube.com/maigols");
			break;
			
		case "MaigolLinkTW":
			OpenInBrowser("http://www.twitch.tv/maigols");
			break;
			
		case "RioLinkMG":
			OpenInBrowser("http://tocadorio.cf");
			break;
			
		case "RioLinkPB":
			OpenInBrowser("http://nothingbtw.com");
			break;
			
		case "AndresoLinkMG":
			OpenInBrowser("http://andreso.cf");
			break;
			
		case "AndresoLinkOF":
			OpenInBrowser("http://foromangaka.epizy.com/");
			break;
			
		case "CloseBtn":
			AboutWnd.Close(1);
			break;
	}
}
//																		</WindowControls>

var SimTimerTime = new Number;
var WebControl;
var NowScanning = new String;
function ScanLink(URL, Engine, TimerOn, TimerTime)
/*URL: URL to scan. Engine: true for URLVoid, false for Sucuri.
TimerOn: If true, closes the window in the especified time in the TimerTime Variable.*/
{
	NowScanning = URL;
	
	ScanWnd = MsgPlus.CreateWnd("GUI.xml", "ScanWindow"); //Open the window
	WebControl = ScanWnd.Browser_GetInterface("Browser"); //Initialize IE and navigate to the scan
	
	if(Engine==true || Engine=="true")
	{
		WebControl.Navigate2("http://www.urlvoid.com/scan/"+URL);
	}
	else
	{
		WebControl.Navigate2("https://sitecheck.sucuri.net/results/"+URL);
	}
	
	if(TimerOn)
	{
		SimTimerTime = TimerTime;
		MsgPlus.AddTimer("Countdown", 1000);
		ScanWnd.SetControlText("Countdown", "This window will close in "+SimTimerTime+"...");
	}
}

function OnEvent_Timer(Countdown)
{
	if(SimTimerTime > 0)
	{
		ScanWnd.SetControlText("Countdown", "This window will close in "+(SimTimerTime - 1)+"...");
		SimTimerTime--;
		MsgPlus.AddTimer("Countdown", 1000);
	}
	else
	{
		ScanWnd.Close(1);
		//ignore the error
	}
}

function OpenInBrowser(URL)
{
	Interop.Call("shell32.dll", "ShellExecuteW", 0, "open", URL, 0, 0, 0);
}