#![feature(proc_macro_hygiene, decl_macro)]

#[macro_use] extern crate rocket;
#[macro_use] extern crate rocket_contrib;
#[macro_use] extern crate serde_derive;

use std::time::Duration;

use rocket_contrib::json::JsonValue;
use rocket_contrib::serve::StaticFiles;

const SERVICE_NAME: &'static str = "_airplay._tcp.local";

#[derive(Serialize)]
struct Device {
    address: String,
    name: String,
}

#[get("/devices", format = "json")]
fn device_list() -> JsonValue {
    let discover = mdns::discover::all(SERVICE_NAME).unwrap().timeout(Duration::from_secs(5));

    fn device_from_record(record: &mdns::Record) -> Option<Device> {
        match record.kind {
            mdns::RecordKind::A(addr) => Some(Device { address: addr.to_string(), name: record.name.clone() }),
            _ => None,
        }
    }

    fn device_from_response(response: mdns::Response) -> Option<Device> {
        response.additional.iter().filter_map(device_from_record).next()
    }

    json!(discover.filter_map(|response| response.ok().and_then(device_from_response)).collect::<Vec<Device>>())
}

fn main() {
    rocket::ignite()
        .mount("/", StaticFiles::from("public"))
        .mount("/api", routes![device_list]).launch();
}
