import Realm from "realm";

const ThingySchema = {
    name: 'Thingy',
    properties: {
        thingy: 'string',
        timeStamp: 'date'
    }
};

export default class RealmService {

    static _realm;

    static openRealm = async () => {
        if (!!!RealmService._realm) {
            try {
                RealmService._realm = await Realm.open({
                    schema: [ThingySchema],
                    schemaVersion: 1
                });
            } catch (error) {
                console.log(`Could not open realm - ${error.message}`);
            }
        }
    };

    static closeRealm = () => {
        if (!!RealmService._realm) {
            try {
                RealmService._realm.close();
                RealmService._realm = undefined;
            } catch (error) {
                console.log(`Could not close realm - ${error.message}`);
            }
        }
    };

    static _deleteAll = () => {
        try {
            RealmService._realm.write(() => {
                RealmService._realm.deleteAll();
            });
            console.log("Deleted all records");
        } catch (error) {
            console.log(`Could not delete all objects in realm - ${error.message}`);
        }
    };

    static deleteRecord = (record) => {
        try {
            RealmService._realm.write(() => {
                RealmService._realm.delete(record);
            });
        } catch (error) {
            console.log(`Could not delete record in realm - ${error.message}`);
        }
    };

    static getRecords = async (recordType) => {
        await RealmService.openRealm();
        let records;
        try {
            records = RealmService._realm.objects(recordType).sorted('timeStamp');
        } catch (error) {
            console.log(`Could not retrieve records in realm - ${error.message}`);
            throw error;
        }
        return records;
    };

    static saveStatusRecord = async (thingyName) => {
        await RealmService.openRealm();
        try {
            RealmService._realm.write(() => {
                RealmService._realm.create('Thingy', {
                    thingy: thingyName,
                    timeStamp: new Date()
                });
            });
        } catch (error) {
            console.log(`Could not save record in realm - ${error.message}`);
            throw error;
        }
    };
}
