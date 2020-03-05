import React, {Component} from 'react';
import {View, TouchableOpacity, Text} from 'react-native';
import RealmService from './Realm.service';

let buttonPressCount = 0;
let isBlocked = false;

export default class App extends Component {
    constructor(props) {
        super(props);
    }

    componentDidMount(): void {
        setInterval(async () => {
            if (!isBlocked) {
                isBlocked = true;
                const thingies = await this.getPayloads();
                console.log('-------------------------------------------------------------');


                for (const thingy of thingies) {

                    // WHY??!??!?!?!?
                    if (thingy) {
                        let deletionChance = Math.floor(Math.random() * 2);
                        console.log('Processing:         ', thingy);
                        await this.setTimeoutPromise(1000);
                        console.log(`\n\n     deleting:     ${thingy.thingy}\n\n`);

                        while (deletionChance !== 1) {
                            console.log(`Could not delete: ${thingy.thingy}`);
                            console.log("Retrying...");
                            deletionChance = Math.floor(Math.random() * 2);
                        }
                        RealmService.deleteRecord(thingy);
                    }
                }
                isBlocked = false;
            }
        }, 10000);
    }

    setTimeoutPromise = timeout => {
        return new Promise(resolve => setTimeout(resolve, timeout));
    };

    getPayloads = async () => {
        return RealmService.getRecords('Thingy');
    };

    saveThingy = async () => {
        buttonPressCount++;
        await RealmService.saveStatusRecord('Thingy' + buttonPressCount);
    };

    render() {
        return (
            <View style={{
                flex: 1,
                justifyContent: 'center',
            }}>
                <TouchableOpacity
                    style={{
                        alignItems: 'center',
                        backgroundColor: '#DDDDDD',
                        padding: 10,
                    }}
                    onPress={this.saveThingy}
                >
                    <Text>Add Record</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={{
                        marginTop: 100,
                        alignItems: 'center',
                        backgroundColor: '#DDDDDD',
                        padding: 10,
                    }}
                    onPress={RealmService._deleteAll}
                >
                    <Text>Delete All Records</Text>
                </TouchableOpacity>
            </View>
        );
    }
}
