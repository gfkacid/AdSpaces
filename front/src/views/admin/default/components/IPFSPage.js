import { Buffer } from "buffer";
import * as IPFS from "ipfs-core";
import { useState } from "react";

const ipfs = await IPFS.create();

export default function IPFSPage() {
  const [file, setFile] = useState(null);
  const [urlArray, setUrlArray] = useState([]);

  //Use following command to create a random file: head -c 1M </dev/urandom >myfile2

  const retrieveFile = (e) => {
    const data = e.target.files[0];
    const reader = new window.FileReader();
    reader.readAsArrayBuffer(data);

    reader.onloadend = () => {
      setFile(Buffer(reader.result));
    };

    e.preventDefault();
  };

  const uploadFile = async (e) => {
    e.preventDefault();

    try {
      const created = await ipfs.add(file);
      const url = `https://ipfs.io/ipfs/${created.path}`;
      console.log("New file url:", url);

      setUrlArray((prev) => [...prev, url]);
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <div className="App">
      <header className="App-header">IPFS Helper</header>

      <div className="main">
        <form onSubmit={uploadFile}>
          <input type="file" onChange={retrieveFile} />
          <button type="submit" className="button">
            Submit
          </button>
        </form>
      </div>
      <div className="display">
        {urlArray.length !== 0 ? (
          urlArray.map((file, i) => (
            <a href={file} key={i} alt="link">
              {file}
            </a>
          ))
        ) : (
          <h3>Upload a file.</h3>
        )}
      </div>
    </div>
  );
}
