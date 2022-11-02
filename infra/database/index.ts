import { AppDataSource } from './data-source';

export const startConnection = async () => {
  await AppDataSource.initialize()
    .then(() => {
        console.log("Data Source has been initialized!")
    })
    .catch((err) => {
        console.error("Error during Data Source initialization", err)
    })
};

export const disconnect = async () => {
    await AppDataSource.destroy()
      .then(() => {
          console.log("Data Source has been destroyed!")
      })
      .catch((err) => {
          console.error("Error during Data Source destroing", err)
      })
  };
