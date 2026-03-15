import Principal "mo:core/Principal";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Iter "mo:core/Iter";
import List "mo:core/List";
import Runtime "mo:core/Runtime";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";

actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  public type UserProfile = {
    name : Text;
    // Additional user metadata can be added here
  };

  public type SavedTrip = {
    id : Text;
    origin : Text;
    destination : Text;
    departureDate : Text;
    returnDate : Text;
    cabinClass : Text;
    passengers : Nat;
    price : Text;
    providerName : Text;
    tripType : Text; // "flight" or "hotel"
    savedAt : Int; // timestamp
  };

  let userProfiles = Map.empty<Principal, UserProfile>();
  let savedTrips = Map.empty<Principal, List.List<SavedTrip>>();

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access this function");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Saved Trips functionality

  public shared ({ caller }) func saveTrip(trip : SavedTrip) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save trips");
    };

    let trips = switch (savedTrips.get(caller)) {
      case (null) { List.empty<SavedTrip>() };
      case (?existing) { existing };
    };

    let filteredTrips = trips.filter(
      func(existingTrip) {
        existingTrip.id != trip.id;
      }
    );

    filteredTrips.add(trip);
    savedTrips.add(caller, filteredTrips);
  };

  public query ({ caller }) func getSavedTrips() : async [SavedTrip] {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can get saved trips");
    };

    switch (savedTrips.get(caller)) {
      case (null) { [] };
      case (?trips) { trips.toArray() };
    };
  };

  public shared ({ caller }) func deleteTrip(id : Text) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can delete trips");
    };

    switch (savedTrips.get(caller)) {
      case (null) { () }; // No trips to delete
      case (?trips) {
        let filteredTrips = trips.filter(
          func(trip) {
            trip.id != id;
          }
        );
        savedTrips.add(caller, filteredTrips);
      };
    };
  };
};
