function buildingToCows(token) { 
    console.log("koe");
    axios.get("https://test.tygron.com/api/session/items/buildings/?f=JSON&token="+token).then(function(response){
       for (building of response.data) {
            axios.post("https://test.tygron.com/api/session/event/editorbuilding/set_function/?token="+token, JSON.stringify([building.id,889]));
       }
    })
}