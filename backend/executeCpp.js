const fs = require("fs");
const { exec } = require("child_process");
const path = require("path");

const outputPath = path.join(__dirname, "outputs");

if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath, { recursive: true });
}
const executeCpp = async (filepath) => {
  const jobId = path.basename(filepath).split(".")[0];
  const outPath = path.join(outputPath, `${jobId}.exe `);

      return new Promise ((resolve, reject) => {

    //       exec(
    //         `g++ ${filepath} -o ${outPath} && cd ${outputPath} && ./${jobId}.exe`,
    //               (error, stdout, stderr) => {
    //               if(error) {
    //                       reject({error,stderr});
    //               }
    //               if(stderr){
    //                   reject({stderr});
    //               }
    //               resolve(stdout);
    //             resolve({stdout});
    //   });
    exec(
        `powershell -Command "g++ ${filepath} -o ${outPath}; cd ${outputPath};  Get-Content ${jobId}.txt | ./${jobId}.exe" `,
        (error, stdout, stderr) => {
          if (error) {
            console.error('Execution error:', error);
            reject({ error });
          } else if (stderr) {
            console.error('Standard error:', stderr);
            reject({ stderr });
          } else {
            console.log('Execution succeeded:', stdout);
            resolve( stdout );
          }
        }
      );
      
  });
//&& cd ${outputPath} && ./${jobId}.exe
};

module.exports = {
  executeCpp,
};
