/* eslint-disable react/jsx-no-target-blank */
import React, { useEffect, useState } from "react";

const Dropboxapp = () => {
  const [filesfolders, setFilesFolders] = useState([]);
  const [currentpath, setCurrentPath] = useState();
  const [code, setCode] = useState("");
  //const [accesstoken, setAccessToken] = useState("");
  const [components, setComponents] = useState({ show: false });
  const [logincomponents, setLoginComponents] = useState({ show: true });

  useEffect(() => {
    if(code.length){
    fetchFilesFolders();}
  // eslint-disable-next-line
  }, []);

  const getToken = async() => {
    try{
    const tokenval = await fetch(`${process.env.REACT_APP_GETTOKEN}`, {
      method: "POST",
      headers: {
        "Content-type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id : process.env.REACT_APP_KEY,
        client_secret : process.env.REACT_APP_SECRET,
        grant_type : 'authorization_code',
        code : code.trim()
    }),
    }).then((response) => response.json())
    localStorage.setItem("token",tokenval.access_token)
    fetchFilesFolders()
   // setAccessToken(tokenval.access_token)
  }
  catch{
    alert("Cannot Get Token or Code Expired!!")
  }
  }

  const fetchFilesFolders = async (path = "") => {
    try {
      const storedToken=localStorage.getItem("token")
      setCurrentPath(path);
      const requestBody = {
        include_deleted: false,
        include_has_explicit_shared_members: false,
        include_media_info: false,
        include_mounted_folders: true,
        include_non_downloadable_files: true,
        path: path,
        recursive: false,
      };
      const filefolderData = await fetch(`${process.env.REACT_APP_GETFILES}`, {
        method: "POST",
        body: JSON.stringify(requestBody),
        headers: {
          "Content-type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      }).then((response) => response.json());
      setFilesFolders(filefolderData);
      setComponents({ show: true });
      setLoginComponents({show:false})
    } catch {
      alert("Cannot Fetch Files & Folders or Code Expired!!");
    }
  };

  const uploadFile = async (e) => {
    try {
      const storedToken=localStorage.getItem("token")
      const reader = e.target.files[0];
      await fetch(`${process.env.REACT_APP_UPLOAD}`, {
        method: "POST",
        body: reader,
        headers: {
          "Content-type": "application/octet-stream",
          Authorization: `Bearer ${storedToken}}`,
          "Dropbox-API-Arg": JSON.stringify({
            autorename: false,
            mode: "add",
            mute: false,
            path: `${currentpath}/${e.target.files[0].name}`,
            strict_conflict: false,
          }),
        },
      }).then((response) => response.json());
      e.target.value = null;
      fetchFilesFolders(currentpath);
    } catch {
      alert("Cannot Upload File!!");
    }
  };

  const backPage = () => {
    let prevpath = currentpath.substring(0, currentpath.lastIndexOf("/"));
    fetchFilesFolders(prevpath);
  };

  const logOut = () => {
    //setAccessToken("");
    setCode("");
    setComponents({ show: false });
    setLoginComponents({show:true})
    setFilesFolders([]);
    localStorage.clear()
  };

  return (
    <div className="Body">
      <h1>MY DROPBOX</h1>
      {logincomponents.show===true && (
      <>
      <a className="Loginlink" href = {`${process.env.REACT_APP_GETCODE}`} target="_blank">CLICK HERE TO GET CODE!!</a>
      <p className="Tokentext">ENTER CODE HERE!!</p><br/>
      <input
        type="password"
        className="Forminput"
        value={code}
        onChange={(e) => setCode(e.target.value)}
      ></input>
      <br/>
      <button className="Submitbutton" onClick={() => getToken()}>LOGIN</button>
      </>
      )}
      {components.show === true && (
        <>
        <button className="Logoutbutton" onClick={() => logOut()}>LOGOUT</button>
        <button
          onClick={() => {
            backPage();
          }}
          className="Backbutton"
        >
          BACK
        </button>
        <label htmlFor="files" className="Uploadbutton">
          UPLOAD
        </label>
      <input
        id="files"
        type="file"
        onChange={uploadFile}
        style={{ visibility: "hidden" }}
      />
        <table>
          <thead>
            <th>Type</th>
            <th>Name</th>
            <th>Path</th>
            <th>Size</th>
            <th>Modified</th>
          </thead>
          <tbody>
            {filesfolders.entries.length ? (
              filesfolders.entries.map((filesfolder) => (
                <tr key={filesfolder.id}>
                  <>
                    <td>
                      {filesfolder[".tag"] === "folder" && (
                        <img
                          className="Filefolder"
                          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT2EG1oDsoGUafCU7A9tdKdH7A8Q50tCDbMsg&usqp=CAU"
                          height="25"
                          width="25"
                          alt=""
                        />
                      )}
                      {filesfolder[".tag"] === "file" && (
                        <img
                          className="Filefolder"
                          src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAOEAAADhCAMAAAAJbSJIAAAAclBMVEX///8AAABCQkL7+/v39/dPT0+mpqbGxsbs7OwXFxe2trbJycl3d3fU1NQvLy+jo6M7OzuPj4/j4+NJSUmFhYVvb29VVVVbW1tnZ2fX19dgYGDg4OAgICA8PDxiYmKTk5MoKCh+fn68vLwLCwucnJySkpJeWSrHAAAErUlEQVR4nO3d63KiQBSFURAiFyUqERM1idHJvP8rzkQdoa1Aw4HeRzP7+03RrECkikvjeYwxxhhjjLFbK87SsdMOWajpyzavvvNei7WWL1i4552a6uzHoEABfX+lQpzigL7/rEAcI4F/92KMBoZzrBB/oEb/Bk4jlz2WRPSBev4dnQZuh3nz1YinH9LE8X9HYPwvQA/UYHUcc+54TFMIJQYPxyFHGGGicKBihQ9LPBErfPLwRLQQT4QLS+IGQ8QL0XtRQQgmagixB6qKEErUESIPVCUhkKglLInvrofWEsL+F/WEKKKiEHSgagpL4ovDKwyqQshe1BVWiM72orIQcKBqCytER5ugLnRO1Be6PlBvQFgSCxfEWxC6PVBvQuj0QL0NocsDFST0TsN81A7jjogSnu+kL2sXuDxLMPSBWiPMZp+z1n3OJtatSv9t/6zucZTLvZspQNj92QXrtYj4V/uVpe6Fglv7O9tAv9uv623Qf5lvhavuwifbcRo+tF/ZxLnwvbtwZR0pH7Ve2cK5MLJswTeN7UOFL21XVjgXerOPbr6k3V99UrRb72rIE0bN2SLMOtX6OYd4O2kqOt8qBgiVCkY/XRhSKIhCbBRKohAbhZIoxEahJAqxUSiJQmwUSqIQG06YL0b1vT3tqlee8uVo3rB0U/PRItcR5raLfqOSuO33fu2HQYQJl03bdKy8ALzvBby63wYT2q+/l3fA+r6+OFIRdtmHfd+x1dmHW9vNvsfy/3DdD5hsVYTedvrY0HxZ/XlYF03LWpoaQJ4PRVGIjUJJFGKjUBKF2CiURCE2CiVRiI1CSf+rMEinRTF13d8hUtMCE4ZPPqqrgVHCTxjQ9z9VhLhdePUaDUwInEjRfOIZJsyAwkxF6EWrBNMqMsYFng+DGNMVhWd8SRRio1AShdgolEQhNgolUYiNQkkUYqNQ0hDzYlxPkmGsaT1uWjozh4UJg36P4xWVldkeAjTn84cJ+37yYnZZk33uAmOqApiwwxQW31Y+M7q3LvugIhTMi2H0fFmT/Rs97ypCwbwYRuUEM/anT43Libjf0q7zYhi9Vm9FpI+Ny37MjHGBZ4tw3W1ijErruP2a1tfD8owviEJsFEqiEBuFkijERqEkCrFRKIlCbBRKqhHGkyiKGidx7N/XCFdTSuKEuw6z/vbqlzk7L0x4APm+OqgIn4HC5+rAMKFgpmRxxgTEMGHatEkDZ0zejbszs4cB9zp3Zjxve0gRHcwJB3jGF0UhNgolUYiNQkkUYqNQEoXYKJREITYKJbkX5tu8vh/whmXU/F74m/mNtTsUbht9XxlPFN+hcGcVvlQXv0Ph3irUmXFguOz3B4zHL+9QaP1WpPlpyDsUet5kt6jv90Fp9ha1KJREITYKJVGIjUJJFGKjUBKF2CiURCE2CiUFp6f05jciPH15aNCvx5/nuUxy+5KA8uS4NYV9yQ6d3ycfdqXSztetFoOudHJaqb9JI+3SzXlbJvbN7lDY96Nbwzf0j0LfSTCGb2zf6G4h59Rt0/A/Cdbr0tiKQU8V5+zzc+Aa9nf0UrZJtGXHkk1m31hhcZaOtUuz2L6hjDHGGGOMMXB/AFbjgPStNOjZAAAAAElFTkSuQmCC"
                          height="25"
                          width="25"
                          alt=""
                        />
                      )}
                    </td>
                    <td>
                      {filesfolder.name}
                      {filesfolder[".tag"] === "folder" && (
                        <button 
                          onClick={() => {
                            fetchFilesFolders(filesfolder.path_display);
                          }}
                        >
                          <span>
                            <img
                              className="Folder"
                              src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRG26ZTpH-BBwLyZS-YR9WRMkczq3LdZtBzMA&usqp=CAU"
                              height="10"
                              width="10"
                              alt=""
                            />
                          </span>
                        </button>
                      )}
                    </td>
                    <td>{filesfolder.path_display}</td>
                    <td>
                      {filesfolder.size < 1024 &&
                        filesfolder[".tag"] === "file" && (
                          <span>{filesfolder.size} Bytes</span>
                        )}
                      {filesfolder.size >= 1024 &&
                        filesfolder.size <= 1048576 &&
                        filesfolder[".tag"] === "file" && (
                          <span>{(filesfolder.size / 1024).toFixed(2)} KB</span>
                        )}
                      {filesfolder.size > 1048576 &&
                        filesfolder[".tag"] === "file" && (
                          <span>
                            {(filesfolder.size / 1048576).toFixed(2)} MB
                          </span>
                        )}
                    </td>
                    <td>
                      {!filesfolder.client_modified && ""}
                      {filesfolder.client_modified &&
                        new Date(filesfolder.client_modified).toLocaleString(
                          undefined,
                          { timeZone: "Asia/Kolkata" }
                        )}
                    </td>
                  </>
                </tr>
              ))
            ) : (
              <td>No files folder found</td>
            )}
          </tbody>
        </table>
        </>
      )}
    </div>
  );
};

export default Dropboxapp;
